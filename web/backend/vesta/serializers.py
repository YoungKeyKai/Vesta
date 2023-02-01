from django.conf import settings
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import InvalidToken
from .models import *


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs):
        attrs['refresh'] = self.context['request'].COOKIES.get(settings.JWT_AUTH['JWT_REFRESH_TOKEN_COOKIE_NAME'])
        if attrs['refresh']:
            return super().validate(attrs)
        else:
            raise InvalidToken("No valid refresh token found")


class CookieTokenRemoveSerializer(serializers.Serializer):
    def validate(self, attrs):
        attrs['refresh'] = self.context['request'].COOKIES.get(settings.JWT_AUTH['JWT_REFRESH_TOKEN_COOKIE_NAME'])
        if attrs['refresh']:
            return {}
        else:
            raise InvalidToken("No valid refresh token found")


class UserUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserUpload
        fields = ('id', 'owner', 'uploadtime', 'content')


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ('id', 'owner', 'visible', 'chatOn')


class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        fields = ('id', 'owner', 'pricerange', 'timerange', 'location', 'rating')


class ListingPropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingProperty
        fields = ('id', 'name', 'address', 'city', 'province')


class ListingListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingListing
        fields = ('id', 'owner', 'propertyID', 'unit', 'duration', 'rate', 'utilities', 'floorplan', 'proof', 'status', 'description')


class ListingInterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingInterest
        fields = ('id', 'buyer', 'seller', 'listing')


class ListingFlaggedListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingFlaggedListing
        fields = ('id', 'listing', 'flagger', 'timestamp', 'type')


class MessagingBlocksSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessagingBlocks
        fields = ('id', 'blocker', 'blocked', 'timestamp')


class MessagingChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessagingChat
        fields = ('id', 'user1', 'user2', 'history')
