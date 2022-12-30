"""
backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from vesta import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = routers.DefaultRouter()
router.register(r'useruploads', views.UserUploadView, 'userupload')
router.register(r'usersettings', views.UserSettingsView, 'usersettings')
router.register(r'userpreferences', views.UserPreferencesView, 'userpreferences')
router.register(r'listingproperties', views.ListingPropertyView, 'listingproperty')
router.register(r'listinglistings', views.ListingListingView, 'listinglisting')
router.register(r'listinginterests', views.ListingInterestView, 'listinginterest')
router.register(r'listingflaggedlistings', views.ListingFlaggedListingView, 'listingflaggedlisting')
router.register(r'messagingblocks', views.MessagingBlocksView, 'messagingblocks')
router.register(r'messagingchats', views.MessagingChatView, 'messagingchat')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='vesta_obtaintoken'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='vesta_refreshtoken'),
]
