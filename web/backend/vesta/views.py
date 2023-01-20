from math import floor
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from .serializers import *
from .models import *


def set_jwt_refresh_token_cookie(response, value, max_age):
    response.set_cookie(
        settings.JWT_AUTH['JWT_REFRESH_TOKEN_COOKIE_NAME'],
        value=value,
        max_age=max_age,
        httponly=True,
        secure=True,
        path=settings.JWT_AUTH['JWT_REFRESH_TOKEN_COOKIE_PATH']
    )


def set_jwt_refresh_token_cookie_if_it_exists(response):
    if response.data.get('refresh'):
        cookie_max_age = floor(settings.JWT_AUTH['JWT_REFRESH_EXPIRATION_DELTA'].total_seconds())
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


class UserUploadView(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = UserUploadSerializer
    queryset = UserUpload.objects.all()


class UserSettingsView(viewsets.ModelViewSet):
    serializer_class = UserSettingsSerializer
    queryset = UserSettings.objects.all()


class UserPreferencesView(viewsets.ModelViewSet):
    serializer_class = UserPreferencesSerializer
    queryset = UserPreferences.objects.all()


class ListingPropertyView(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = ListingPropertySerializer
    queryset = ListingProperty.objects.all()


class ListingListingView(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
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
