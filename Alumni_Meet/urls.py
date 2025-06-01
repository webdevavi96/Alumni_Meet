"""
URL configuration for Alumni_Meet project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from django.urls import path
from Alumni_App import views, update_profile_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('blogs/', views.blogs, name='blogs'),
    path('events/', views.events, name='events'),
    path('admin_profile/', views.admin_profile, name='admin_profile'),
    path('student_profile/<int:student_id>/', views.student_profile, name='student_profile'),
    path('login/', views.login, name='login'),
    path('signUp/', views.signUp, name='signUp'),
    path('accounts/login/', views.login, name='login'),
    path('accounts/signup/', views.signUp, name='signUp'),
    path('verify-otp/', views.verify_otp_ajax, name='verify_otp_ajax'),
    path('resend_otp/', views.resend_otp, name='resend_otp'),
    path('logout/', views.logout, name='logout'),
    path('update_profile/', update_profile_view.update_profile, name='update_profile'),
    path('details/<slug:slug>/',views.details , name='details'),
    path('blogs/new_blog/', views.new_blog, name='new_blog'),
    path('events/new_event/', views.new_event, name='new_event'),
    path('blogs/delete_blog/<slug:slug>/', views.delete_blog, name='delete_blog'),
    path('events/delete_event/<slug:slug>/', views.delete_event, name='delete_event'),
    path('get_latest_blog/', views.latest_blog, name='get_latest_blog'),
    # path('/get_latest_event/', views.get_latest_event, name='get_latest_event'),
] 

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns +=static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)