from django.conf import settings
from django.contrib.auth import get_user_model, hashers
from django.utils import timezone
from rest_framework import serializers, validators
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import InvalidToken
from .models import *


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs):
        attrs['refresh'] = self.context['request'].COOKIES.get(settings.SIMPLE_JWT['JWT_REFRESH_TOKEN_COOKIE_NAME'])
        if attrs['refresh']:
            return super().validate(attrs)
        else:
            raise InvalidToken("No valid refresh token found")


class CookieTokenRemoveSerializer(serializers.Serializer):
    def validate(self, attrs):
        attrs['refresh'] = self.context['request'].COOKIES.get(settings.SIMPLE_JWT['JWT_REFRESH_TOKEN_COOKIE_NAME'])
        if attrs['refresh']:
            return {}
        else:
            raise InvalidToken("No valid refresh token found")


class UserInfoSerializer(serializers.ModelSerializer):
    username = serializers.EmailField(
        required=True,
        validators=[
            validators.UniqueValidator(queryset=get_user_model().objects.all())
        ]
    )
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'first_name', 'last_name', 'last_login', 'date_joined', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'last_login': {'read_only': True},
            'date_joined': {'read_only': True}
        }

    def create(self, validated_data):
        user = AuthUser.objects.create(
            username=validated_data['username'],
            password=hashers.make_password(validated_data['password']),
            email=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            date_joined=timezone.now(),
            is_superuser=False,
            is_staff=False,
            is_active=True
        )
        user.save()
        return user


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
        fields = ('id', 'owner', 'propertyID', 'unit', 'duration', 'rate', 'utilities', 'floorplan', 'proof', 'status', 'description', 'images')


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
