# Generated by Django 5.2 on 2025-06-01 11:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Alumni_App', '0021_event_notify_users'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='event',
            name='isNotified',
        ),
        migrations.RemoveField(
            model_name='event',
            name='isNotify',
        ),
        migrations.RemoveField(
            model_name='event',
            name='notify_users',
        ),
    ]
