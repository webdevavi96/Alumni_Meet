# Generated by Django 5.2 on 2025-05-03 08:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Alumni_App', '0011_blog_blog_details'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blog',
            name='blog_details',
            field=models.JSONField(blank=True, default=list, null=True),
        ),
    ]
