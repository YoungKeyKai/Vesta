# Generated by Django 4.1.5 on 2023-01-26 19:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("vesta", "0003_listinglisting_description_alter_userupload_content"),
    ]

    operations = [
        migrations.RemoveField(model_name="listinginterest", name="status",),
    ]
