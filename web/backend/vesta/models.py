from django.db import models
from django.contrib.postgres.fields import IntegerRangeField, DateRangeField, ArrayField

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
    pricerange = IntegerRangeField()
    timerange = DateRangeField()
    location = ArrayField(
        models.CharField(max_length=64)
    )
    rating = models.DecimalField

    class Meta:
        db_table = 'preferences'

class ListingProperty(models.Model):
    name = models.CharField(max_length=64, null=False)
    address = models.CharField(max_length=128, null=False)
    city = models.CharField(max_length=64, null=False)
    country = models.CharField(max_length=64, null=False)

    class Meta:
        db_table = 'property'

class ListingListing(models.Model):
    owner = models.ForeignKey(AuthUser, on_delete=models.CASCADE, null=False)
    propertyID = models.ForeignKey(ListingProperty, on_delete=models.CASCADE, null=False)
    unit = models.CharField(max_length=16)
    duration = DateRangeField()
    rate = IntegerRangeField()
    utilities = ArrayField(
        models.CharField(max_length=32)
    )
    floorplan = models.ForeignKey(UserUpload, related_name='floorplan_fk', on_delete=models.SET_NULL, null=True)
    proof = models.ForeignKey(UserUpload, related_name='proof_fk', on_delete=models.SET_NULL, null=True)
    
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


