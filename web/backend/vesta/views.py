from math import floor, log
from django.conf import settings
from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from .serializers import *
from .models import *
from psycopg2.extras import NumericRange, DateRange
from datetime import datetime, timedelta


def set_jwt_refresh_token_cookie(response, value, max_age):
    response.set_cookie(
        settings.SIMPLE_JWT['JWT_REFRESH_TOKEN_COOKIE_NAME'],
        value=value,
        max_age=max_age,
        httponly=True,
        secure=True,
        samesite='None',
        path=settings.SIMPLE_JWT['JWT_REFRESH_TOKEN_COOKIE_PATH']
    )


def set_jwt_refresh_token_cookie_if_it_exists(response):
    if response.data.get('refresh'):
        cookie_max_age = floor(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())
        set_jwt_refresh_token_cookie(response, response.data['refresh'], cookie_max_age)
        del response.data['refresh']


class CookieTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def finalize_response(self, request, response, *args, **kwargs):
        set_jwt_refresh_token_cookie_if_it_exists(response)
        return super().finalize_response(request, response, *args, **kwargs)


class CookieTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]
    serializer_class = CookieTokenRefreshSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        set_jwt_refresh_token_cookie_if_it_exists(response)
        return super().finalize_response(request, response, *args, **kwargs)


class CookieTokenRemoveView(GenericAPIView):
    serializer_class = CookieTokenRemoveSerializer

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            response = Response('Successfully removed refresh token', status=status.HTTP_200_OK)
            set_jwt_refresh_token_cookie(response, '', -1)
            return response

class UserInfoView(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = UserInfoSerializer
    queryset = AuthUser.objects.all()


class UserUploadView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = UserUploadSerializer
    queryset = UserUpload.objects.all()


class UserSettingsView(viewsets.ModelViewSet):
    serializer_class = UserSettingsSerializer
    queryset = UserSettings.objects.all()


class UserPreferencesView(viewsets.ModelViewSet):
    serializer_class = UserPreferencesSerializer
    queryset = UserPreferences.objects.all()


class ListingPropertyView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = ListingPropertySerializer
    queryset = ListingProperty.objects.all()


class ListingListingView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = ListingListingSerializer
    queryset = ListingListing.objects.all()

    def list(self, request):
        """ 
        Override default list method to filter using custom parameters
        """

        queryset = self.filter_queryset(self.queryset)
        
        # Parameters
        params = request.GET
        auth_user_id = request.user.id

        try:
            # Filter by owner OR interested listings
            # Otherwise, filter by other filters
            owner_id_query = params.get('ownerId')
            if owner_id_query:
                owner_id_query = int(owner_id_query)
                queryset = queryset.filter(owner=owner_id_query).distinct()
            elif params.get('interested') == 'true':
                # If request is not authenticated, this query is malformed
                if auth_user_id is None:
                    raise ValueError
                queryset = queryset.filter(listinginterest__buyer=auth_user_id).distinct()
            else:
                # Show only available listings
                queryset = queryset.filter(status='available')

                # Filter away listings owned by authenticated user if one exists
                if auth_user_id:
                    queryset = queryset.filter(~Q(owner=auth_user_id))

                # Price Filter
                if params.get('minprice'):
                    price_range = NumericRange(
                        int(params.get('minprice', 0)),
                        int(params.get('maxprice', 10000)),
                    )
                    queryset = queryset.filter(rate__overlap=price_range)

                # DateRange Filter
                if params.get('startDate') or params.get('endDate'):
                    # Decrease intervals by one in either direction for inclusivity.
                    start_date = datetime.today().strftime('%Y-%m-%d')
                    end_date = '2099-12-31'
                    if params.get('startDate'):
                        start_date = datetime.strptime(params.get('startDate'), '%Y-%m-%d')
                    if params.get('endDate'):
                        end_date = datetime.strptime(params.get('endDate'), '%Y-%m-%d')
                    start_date += timedelta(days=1)
                    end_date += timedelta(days=-1)
                    date_range = DateRange(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d'))
                    queryset = queryset.filter(duration__contains=date_range)

                # Filter By Location
                if params.get('location'):
                    queryset = queryset.filter(propertyID__city__icontains=params.get('location'))

                # Filter By Utilities
                utilities = list()
                for utility in ['Wifi', 'Electricity', 'Kitchen', 'Laundry', 'Food']:
                    if params.get(utility) == 'true':
                        utilities.append(utility)
                if len(utilities):
                    queryset = queryset.filter(utilities__contains=utilities)

                # Use search term to filter by property name, location or description
                if params.get('search'):
                    q1 = queryset.filter(propertyID__name__icontains=params.get('search'))
                    q2 = queryset.filter(propertyID__city__icontains=params.get('search'))
                    q3 = queryset.filter(propertyID__address__icontains=params.get('search'))
                    q4 = queryset.filter(description__icontains=params.get('search'))
                    queryset = (q1 | q2 | q3 | q4).distinct()
            
                # Sort Queryset by relevancy metric using weighted model
                def get_relevancy(listing: ListingListing):
                    wsum = 0
                    # Description Length
                    wsum += len(listing.description or "") * 0.082
                    # Completeness of Listing
                    completeness = 0
                    for field in listing._meta.get_fields():
                        try:
                            if getattr(listing, field.name) is not None:
                                completeness += 1
                        except:
                            pass
                    wsum += completeness * 0.229
                    # Recency of Post (timestamps not stored)
                    wsum += 0.320 / (log(listing.pk) + 1)
                    if listing.rate and listing.rate.lower:
                        if listing.rate.upper:
                            # Specificity of Asking Price
                            wsum += 0.263 / (log(listing.rate.upper - listing.rate.lower) + 1)
                        # Closeness of Asking Price LB to Price Filter LB
                        lb = params.get('minprice')
                        if lb:
                            wsum += 0.115 / (log(abs(int(lb) - listing.rate.lower)) + 1)
                    # Available Utilities
                    wsum += 0.048 * len(listing.utilities or [])
                    # Number of Interested Users (TBD - requires extra query)

                    q = params.get('search')
                    if q:
                        # Property Name contains Search Term
                        if listing.propertyID.name and q in listing.propertyID.name:
                            wsum += 0.547 * len(q) / len(listing.propertyID.name or "")
                        # Address contains Search Term
                        if listing.propertyID.address and q in listing.propertyID.address:
                            wsum += 0.482 * len(q) / len(listing.propertyID.address or "")
                        # Location contains Search Term
                        if listing.propertyID.city and q in listing.propertyID.city:
                            wsum += 0.312 * len(q) / len(listing.propertyID.city or "")
                        # Description contains Search Term
                        if listing.description and q in listing.description:
                            wsum += 0.202
                    # Available Utilities (of selected)
                    if listing.utilities:
                        for utility in ['Wifi', 'Electricity', 'Kitchen', 'Laundry', 'Food']:
                            if params.get(utility) == 'true' and utility in listing.utilities:
                                wsum += 0.156
                    
                    return wsum
                
                queryset = sorted(queryset, key=get_relevancy, reverse=True)
        except:
            # Parameters not well formed
            raise ValueError

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ListingInterestView(viewsets.ModelViewSet):
    serializer_class = ListingInterestSerializer
    queryset = ListingInterest.objects.all()


class ListingFlaggedListingView(viewsets.ModelViewSet):
    serializer_class = ListingFlaggedListingSerializer
    queryset = ListingFlaggedListing.objects.all()


class MessagingBlocksView(viewsets.ModelViewSet):
    serializer_class = MessagingBlocksSerializer
    queryset = MessagingBlocks.objects.all()


class MessagingChatView(viewsets.ModelViewSet):
    serializer_class = MessagingChatSerializer
    queryset = MessagingChat.objects.all()
