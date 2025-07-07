from django.contrib import admin
from .models import Community, Messages
# Register your models here.


@admin.register(Community)
class CommunityAdmin(admin.ModelAdmin):
    list_display = ('community_name', 'community_id')
    search_fields = ('community_name', 'community_id')
    
admin.site.register(Messages)