from rest_framework import routers
from django.urls import path, include
from . import views

router = routers.DefaultRouter()
router.register(r'userinfo', views.UserInfoView, 'userinfo')
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
    path('', include(router.urls)),
    path('auth/login/', views.CookieTokenObtainPairView.as_view(), name='vesta_login'),
    path('auth/token/refresh/', views.CookieTokenRefreshView.as_view(), name='vesta_refreshtoken'),
    path('auth/token/remove/', views.CookieTokenRemoveView.as_view(), name='vesta_removetoken'),
]
