# Generated by Django 5.2 on 2025-06-01 07:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Alumni_App', '0018_event_author'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='link',
            field=models.URLField(blank=True, max_length=300, null=True),
        ),
    ]
