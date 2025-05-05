from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage



@login_required
def update_profile(request):
    if request.method == 'POST':
        user = request.user  # Get the logged-in user

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
        if bio:
            user.bio = bio
        if profile_picture:
            # Save the uploaded file to the media directory
            fs = FileSystemStorage()
            filename = fs.save(profile_picture.name, profile_picture)
            user.profile_picture = filename

        user.save()

        return redirect('profile')

    # Render the edit profile form if the request is GET
    return render(request, 'pages/edit_profile_form.html')
