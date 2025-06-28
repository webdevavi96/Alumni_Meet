from django.contrib import admin
from .models import Community
# Register your models here.


@admin.register(Community)
class CommunityAdmin(admin.ModelAdmin):
    list_display = ('community_name', 'community_id')
    search_fields = ('community_name', 'community_id')