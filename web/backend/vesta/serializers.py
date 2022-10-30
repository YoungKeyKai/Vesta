from rest_framework import serializers
from .models import *

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
        fields = ('id', 'owner', 'propertyID', 'unit', 'duration', 'rate', 'utilities', 'floorplan', 'proof', 'status')

class ListingInterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingInterest
        fields = ('id', 'buyer', 'seller', 'listing', 'status')

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