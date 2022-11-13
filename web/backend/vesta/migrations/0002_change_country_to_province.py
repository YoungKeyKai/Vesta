# Generated by Django 4.0.6 on 2022-11-13 21:30

from django.db import migrations, models
import vesta.validators


class Migration(migrations.Migration):

    dependencies = [
        ('vesta', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='listingproperty',
            name='country',
        ),
        migrations.AddField(
            model_name='listingproperty',
            name='province',
            field=models.CharField(default='ON', max_length=2, validators=[vesta.validators.validate_province]),
            preserve_default=False,
        ),
    ]
