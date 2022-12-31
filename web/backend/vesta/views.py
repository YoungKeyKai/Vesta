from rest_framework import viewsets
from .serializers import *
from .models import *

# Create your views here.

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