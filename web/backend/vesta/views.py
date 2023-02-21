from math import floor
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

    def get_queryset(self):
        user = self.request.user
        return AuthUser.objects.filter(id=user.id)


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

            # Filter by owner OR interested listings, otherwise, only return available listings
            owner_id_query = params.get('ownerId')
            if owner_id_query:
                owner_id_query = int(int(owner_id_query))
                queryset = queryset.filter(owner=owner_id_query)
                if owner_id_query != auth_user_id:
                    queryset = queryset.filter(status='available')
            elif params.get('interested') == 'true':
                # If request is not authenticated, this query is malformed
                if auth_user_id is None:
                    raise ValueError
                queryset = queryset.filter(listinginterest__buyer=auth_user_id)
            else:
                # Show only available listings if not showing only owned listings
                queryset = queryset.filter(status='available')
                if auth_user_id:
                    queryset = queryset.filter(~Q(owner=auth_user_id))

            # Use search term to filter by property name, location or description
            if params.get('search'):
                q1 = queryset.filter(propertyID__name__icontains=params.get('search'))
                q2 = queryset.filter(propertyID__city__icontains=params.get('search'))
                q3 = queryset.filter(propertyID__address__icontains=params.get('search'))
                q4 = queryset.filter(description__icontains=params.get('search'))
                queryset = (q1 | q2 | q3 | q4).distinct()
        except:
            # Parameters not well formed
            raise ValueError('Illegal query')

        # Return only distinct listings
        queryset = queryset.distinct()

        # Sort Queryset by newest first
        queryset = queryset.order_by('-id')

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
