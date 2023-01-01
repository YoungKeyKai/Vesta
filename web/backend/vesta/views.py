from math import floor
from django.conf import settings
from rest_framework import viewsets
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from .serializers import *
from .models import *


def set_jwt_refresh_token_cookie(response):
    if response.data.get('refresh'):
        cookie_max_age = floor(settings.JWT_AUTH['JWT_REFRESH_EXPIRATION_DELTA'].total_seconds())
        response.set_cookie(
            settings.JWT_AUTH['JWT_REFRESH_TOKEN_COOKIE_NAME'],
            response.data['refresh'],
            max_age=cookie_max_age,
            httponly=True,
            secure=True
        )
        del response.data['refresh']


class CookieTokenObtainPairView(TokenObtainPairView):
    def finalize_response(self, request, response, *args, **kwargs):
        set_jwt_refresh_token_cookie(response)
        return super().finalize_response(request, response, *args, **kwargs)


class CookieTokenRefreshView(TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        set_jwt_refresh_token_cookie(response)
        return super().finalize_response(request, response, *args, **kwargs)


class UserUploadView(viewsets.ModelViewSet):
    serializer_class = UserUploadSerializer
    queryset = UserUpload.objects.all()


class UserSettingsView(viewsets.ModelViewSet):
    serializer_class = UserSettingsSerializer
    queryset = UserSettings.objects.all()


class UserPreferencesView(viewsets.ModelViewSet):
    serializer_class = UserPreferencesSerializer
    queryset = UserPreferences.objects.all()


class ListingPropertyView(viewsets.ModelViewSet):
    serializer_class = ListingPropertySerializer
    queryset = ListingProperty.objects.all()


class ListingListingView(viewsets.ModelViewSet):
    serializer_class = ListingListingSerializer
    queryset = ListingListing.objects.all()


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
