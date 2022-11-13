from django.contrib import admin
from .models import *

class UserUploadAdmin(admin.ModelAdmin):
    list_display = ('owner', 'uploadtime', 'content')

class UserSettingsAdmin(admin.ModelAdmin):
    list_display = ('owner', 'visible', 'chatOn')

class UserPreferencesAdmin(admin.ModelAdmin):
    list_display = ('owner', 'pricerange', 'timerange', 'location', 'rating')

class ListingPropertyAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'city', 'province')

class ListingListingAdmin(admin.ModelAdmin):
    list_display = ('owner', 'propertyID', 'unit', 'duration', 'rate', 'utilities', 'floorplan', 'proof', 'status')

class ListingInterestAdmin(admin.ModelAdmin):
    list_display = ('buyer', 'seller', 'listing', 'status')

class ListingFlaggedListingAdmin(admin.ModelAdmin):
    list_display = ('listing', 'flagger', 'timestamp', 'type')

class MessagingBlocksAdmin(admin.ModelAdmin):
    list_display = ('blocker', 'blocked', 'timestamp')

class MessagingChatAdmin(admin.ModelAdmin):
    list_display = ('user1', 'user2', 'history')
    

# Register your models here.
admin.site.register(UserUpload, UserUploadAdmin)
admin.site.register(UserSettings, UserSettingsAdmin)
admin.site.register(UserPreferences, UserPreferencesAdmin)
admin.site.register(ListingProperty, ListingPropertyAdmin)
admin.site.register(ListingListing, ListingListingAdmin)
admin.site.register(ListingInterest, ListingInterestAdmin)
admin.site.register(ListingFlaggedListing, ListingFlaggedListingAdmin)
admin.site.register(MessagingBlocks, MessagingBlocksAdmin)
admin.site.register(MessagingChat, MessagingChatAdmin)