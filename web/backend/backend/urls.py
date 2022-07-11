"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from vesta import views

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
]
