# Generated by Django 4.0.6 on 2022-11-06 22:43

import django.contrib.postgres.fields
import django.contrib.postgres.fields.ranges
from django.db import migrations, models
import django.db.models.deletion
import vesta.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AuthGroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150, unique=True)),
            ],
            options={
                'db_table': 'auth_group',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthGroupPermissions',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'auth_group_permissions',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthPermission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('codename', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'auth_permission',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128)),
                ('last_login', models.DateTimeField(blank=True, null=True)),
                ('is_superuser', models.BooleanField()),
                ('username', models.CharField(max_length=150, unique=True)),
                ('first_name', models.CharField(max_length=150)),
                ('last_name', models.CharField(max_length=150)),
                ('email', models.CharField(max_length=254)),
                ('is_staff', models.BooleanField()),
                ('is_active', models.BooleanField()),
                ('date_joined', models.DateTimeField()),
            ],
            options={
                'db_table': 'auth_user',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthUserGroups',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'auth_user_groups',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthUserUserPermissions',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'auth_user_user_permissions',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoAdminLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action_time', models.DateTimeField()),
                ('object_id', models.TextField(blank=True, null=True)),
                ('object_repr', models.CharField(max_length=200)),
                ('action_flag', models.SmallIntegerField()),
                ('change_message', models.TextField()),
            ],
            options={
                'db_table': 'django_admin_log',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoContentType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('app_label', models.CharField(max_length=100)),
                ('model', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'django_content_type',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoMigrations',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('app', models.CharField(max_length=255)),
                ('name', models.CharField(max_length=255)),
                ('applied', models.DateTimeField()),
            ],
            options={
                'db_table': 'django_migrations',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoSession',
            fields=[
                ('session_key', models.CharField(max_length=40, primary_key=True, serialize=False)),
                ('session_data', models.TextField()),
                ('expire_date', models.DateTimeField()),
            ],
            options={
                'db_table': 'django_session',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ListingProperty',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64)),
                ('address', models.CharField(max_length=128)),
                ('city', models.CharField(max_length=64)),
                ('country', models.CharField(max_length=64)),
            ],
            options={
                'db_table': 'property',
            },
        ),
        migrations.CreateModel(
            name='UserUpload',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uploadtime', models.DateTimeField(null=True)),
                ('content', models.FileField(upload_to='uploads')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='vesta.authuser')),
            ],
            options={
                'db_table': 'uploads',
            },
        ),
        migrations.CreateModel(
            name='UserSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('visible', models.BooleanField(default=True)),
                ('chatOn', models.BooleanField(default=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='vesta.authuser')),
            ],
            options={
                'db_table': 'settings',
            },
        ),
        migrations.CreateModel(
            name='UserPreferences',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pricerange', django.contrib.postgres.fields.ranges.IntegerRangeField(blank=True)),
                ('timerange', django.contrib.postgres.fields.ranges.DateRangeField(blank=True)),
                ('location', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=64), blank=True, size=None)),
                ('rating', models.DecimalField(blank=True, decimal_places=2, max_digits=2, null=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='vesta.authuser')),
            ],
            options={
                'db_table': 'preferences',
            },
        ),
        migrations.CreateModel(
            name='MessagingChat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('history', django.contrib.postgres.fields.ArrayField(base_field=vesta.models.MessageField(), size=None)),
                ('user1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chat_user1_fk', to='vesta.authuser')),
                ('user2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chat_user2_fk', to='vesta.authuser')),
            ],
            options={
                'db_table': 'chat',
            },
        ),
        migrations.CreateModel(
            name='MessagingBlocks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(null=True)),
                ('blocked', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='blocks_blocked_fk', to='vesta.authuser')),
                ('blocker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='blocks_blocker_fk', to='vesta.authuser')),
            ],
            options={
                'db_table': 'blocks',
            },
        ),
        migrations.CreateModel(
            name='ListingListing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('unit', models.CharField(blank=True, max_length=16)),
                ('duration', django.contrib.postgres.fields.ranges.DateRangeField(blank=True)),
                ('rate', django.contrib.postgres.fields.ranges.IntegerRangeField(blank=True)),
                ('utilities', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=32), blank=True, size=None)),
                ('status', models.CharField(choices=[('available', 'Available'), ('sold', 'Sold'), ('unavailable', 'Unavailable')], default='available', max_length=15)),
                ('floorplan', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='floorplan_fk', to='vesta.userupload')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='vesta.authuser')),
                ('proof', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='proof_fk', to='vesta.userupload')),
                ('propertyID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='vesta.listingproperty')),
            ],
            options={
                'db_table': 'listing',
            },
        ),
        migrations.CreateModel(
            name='ListingInterest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('closed', 'Closed'), ('sold', 'Sold'), ('pending', 'Pending')], default='pending', max_length=15)),
                ('buyer', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='buyer_fk', to='vesta.authuser')),
                ('listing', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='vesta.listinglisting')),
                ('seller', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='seller_fk', to='vesta.authuser')),
            ],
            options={
                'db_table': 'interest',
            },
        ),
        migrations.CreateModel(
            name='ListingFlaggedListing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(null=True)),
                ('type', models.CharField(choices=[('Illegal', 'Illegal'), ('Unethical', 'Unethical'), ('Inappropriate', 'Inappropriate')], max_length=20, null=True)),
                ('flagger', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='vesta.authuser')),
                ('listing', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='vesta.listinglisting')),
            ],
            options={
                'db_table': 'flagged_listing',
            },
        ),
    ]
