# Generated by Django 4.1.5 on 2023-03-02 01:45

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vesta', '0005_listinglisting_listing_owner_i_0c8e12_idx_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='listinglisting',
            name='images',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.URLField(blank=True, null=True), blank=True, null=True, size=None),
        ),
    ]
