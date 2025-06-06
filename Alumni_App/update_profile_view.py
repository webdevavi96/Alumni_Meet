from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage



@login_required
def update_profile(request):
    if request.method == 'POST':
        user = request.user

        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        address = request.POST.get('address')
        website = request.POST.get('website')
        github = request.POST.get('github')
        linkedin = request.POST.get('linkedin')
        instagram = request.POST.get('instagram')
        facebook = request.POST.get('facebook')
        enrollment_number = request.POST.get('enrollment_number')
        profile_picture = request.FILES.get('profile_picture')
        bio = request.POST.get('bio')
        
        if  first_name:
            user.first_name = first_name
        if last_name:
            user.last_name = last_name
        if email:
            user.email = email
        if phone:
            user.phone = phone
        if address:
            user.address = address
        if website:
            user.website = website
        if github:
            user.github = github
        if linkedin:
            user.linkedin = linkedin
        if instagram:
            user.instagram = instagram
        if facebook:
            user.facebook = facebook
        if enrollment_number:
            user.enrollment_number = enrollment_number
        if bio:
            user.bio = bio
        if profile_picture:
            fs = FileSystemStorage()
            filename = fs.save(profile_picture.name, profile_picture)
            user.profile_picture = filename

        user.save()

        return redirect('profile')

    return render(request, 'pages/edit_profile_form.html')
