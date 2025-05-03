from django.contrib import admin
from .models import CustomUser, Alumni, Teacher, Student, Event, Blog
from django.contrib.auth.admin import UserAdmin

# Register your models here.

admin.site.register(CustomUser, UserAdmin)

@admin.register(Alumni)
class AlumniAdmin(admin.ModelAdmin):
    list_display = ['user__first_name', 'user__last_name', 'user__email', 'user__phone']
    list_filter = ['user__user_type']

@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ['user__first_name', 'user__last_name', 'user__email', 'user__phone']
    list_filter = ['user__user_type']

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['user__first_name', 'user__last_name', 'user__email', 'user__phone', 'branch']
    list_filter = ['user__user_type', 'branch']

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'date', 'time')
    search_fields = ('title', 'description')
    list_filter = ('date',)
    
@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at')
    search_fields = ('title', 'content')
    list_filter = ('created_at',)
    raw_id_fields = ('author',)


