from tkinter import CASCADE
from django.db import models, connection
from django.contrib.postgres.fields import IntegerRangeField, DateRangeField, ArrayField
from psycopg2.extras import register_composite
from psycopg2.extensions import register_adapter, adapt, AsIs

from .validators import validate_province

# Django Auto-generated models

class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)

# The User Model
class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'

# Custom Models Begin Here.
###########################
###########################

class UserUpload(models.Model):
    owner = models.ForeignKey("AuthUser", on_delete=models.CASCADE, null=False)
    uploadtime = models.DateTimeField(null=True)
    content = models.FileField(upload_to='uploads')

    class Meta:
        db_table = 'uploads'

class UserSettings(models.Model):
    owner = models.ForeignKey(AuthUser, on_delete=models.CASCADE, null=False)
    visible = models.BooleanField(default=True)
    chatOn = models.BooleanField(default=True)

    class Meta:
        db_table = 'settings'

class UserPreferences(models.Model):
    owner = models.ForeignKey(AuthUser, on_delete=models.CASCADE, null=False)
    pricerange = IntegerRangeField(blank=True)
    timerange = DateRangeField(blank=True)
    location = ArrayField(
        models.CharField(max_length=64),
        blank=True
    )
    rating = models.DecimalField(decimal_places=2, max_digits=2, null=True, blank=True)

    class Meta:
        db_table = 'preferences'

class ListingProperty(models.Model):
    name = models.CharField(max_length=64, null=False)
    address = models.CharField(max_length=128, null=False)
    city = models.CharField(max_length=64, null=False)
    province = models.CharField(max_length=2, null=False, validators=[validate_province])

    class Meta:
        db_table = 'property'

class ListingListing(models.Model):
    owner = models.ForeignKey(AuthUser, on_delete=models.CASCADE, null=False)
    propertyID = models.ForeignKey(ListingProperty, on_delete=models.CASCADE, null=False)
    unit = models.CharField(max_length=16, blank=True)
    duration = DateRangeField(blank=True)
    rate = IntegerRangeField(blank=True)
    utilities = ArrayField(
        models.CharField(max_length=32),
        blank=True
    )
    floorplan = models.ForeignKey(UserUpload, related_name='floorplan_fk', on_delete=models.SET_NULL, null=True, blank=True)
    proof = models.ForeignKey(UserUpload, related_name='proof_fk', on_delete=models.SET_NULL, null=True, blank=True)
    
    #Enum Class
    class ListingStatus(models.TextChoices):
        AVAILABLE = 'available'
        SOLD = 'sold'
        UNAVAILABLE = 'unavailable'

    status = models.CharField(
        max_length = 15,
        choices = ListingStatus.choices,
        default = ListingStatus.AVAILABLE
    )

    class Meta:
        db_table = 'listing'

class ListingInterest(models.Model):
    buyer = models.ForeignKey(AuthUser, related_name='buyer_fk', on_delete=models.SET_NULL, null=True)
    seller = models.ForeignKey(AuthUser, related_name='seller_fk', on_delete=models.SET_NULL, null=True)
    listing = models.ForeignKey(ListingListing, on_delete=models.CASCADE, null=False)
    
    #Enum Class
    class InterestStatus(models.TextChoices):
        CLOSED = 'closed'
        SOLD = 'sold'
        PENDING = 'pending'

    status = models.CharField(
        max_length = 15,
        choices = InterestStatus.choices,
        default = InterestStatus.PENDING
    )

    class Meta:
        db_table = 'interest'

class ListingFlaggedListing(models.Model):
    listing = models.ForeignKey(ListingListing, on_delete=models.CASCADE, null=False)
    flagger = models.ForeignKey(AuthUser, on_delete=models.CASCADE, null=False)
    timestamp = models.DateTimeField(null=True)
    
    #Enum Class
    class FlagStatus(models.TextChoices):
        ILLEGAL = 'Illegal'
        UNETHICAL = 'Unethical'
        INAPPROPRIATE = 'Inappropriate'

    type = models.CharField(
        max_length = 20,
        choices = FlagStatus.choices,
        null=True
    )

    #Primary Key
    models.UniqueConstraint(
        name = 'FlaggedListingPK',
        fields = ['listing', 'flagger']
    )

    class Meta:
        db_table = 'flagged_listing'

class MessagingBlocks(models.Model):
    blocker = models.ForeignKey(AuthUser, related_name="blocks_blocker_fk", on_delete=models.CASCADE, null=False)
    blocked = models.ForeignKey(AuthUser, related_name="blocks_blocked_fk", on_delete=models.CASCADE, null=False)
    timestamp = models.DateTimeField(null=True)

    # Primary Key
    models.UniqueConstraint(
        name = 'BlocksPK',
        fields = ['blocker', 'blocked']
    )

    class Meta:
        db_table = 'blocks'

#Define our custom Message Type
Message = register_composite(
    'message',
    connection.cursor().cursor,
    globally=True
).type

def Message_adapter(value):
  return AsIs("(%s, %s, %s)::message" % (
    adapt(value.sender).getquoted(),
    adapt(value.message).getquoted(),
    adapt(value.timestamp).getquoted()
  ))

register_adapter(Message, Message_adapter)

class MessagingMessage:
    def __init__(self, sender, message, timestamp):
        self.sender = sender
        self.message = message
        self.timestamp = timestamp

class MessageField(models.Field):
    def from_db_value(self, value, expression, connection):
      if value is None:
          return value
      return MessagingMessage(value.sender, value.message, value.timestamp)

    def to_python(self, value):
        if isinstance(value, MessagingMessage):
            return value

        if value is None:
            return value

        return MessagingMessage(value.sender, value.message, value.timestamp)

    def get_prep_value(self, value):
        return (value.sender, value.message, value.timestamp)

    def db_type(self, connection):
        return 'message'

class MessagingChat(models.Model):
    user1 = models.ForeignKey(AuthUser, related_name="chat_user1_fk", on_delete=models.CASCADE, null=False)
    user2 = models.ForeignKey(AuthUser, related_name="chat_user2_fk", on_delete=models.CASCADE, null=False)
    history = ArrayField(
        MessageField()
    )

    # Primary Key
    models.UniqueConstraint(
        name = 'ChatPK',
        fields = ['user1', 'user2']
    )

    class Meta:
        db_table = 'chat'