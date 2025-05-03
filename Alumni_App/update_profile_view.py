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

        # Update only the fields that are not empty
        if first_name and first_name != user.first_name:
            user.first_name = first_name
        if last_name and last_name != user.last_name:
            user.last_name = last_name
        if email and email != user.email:
            user.email = email
        if phone and phone != user.phone:
            user.phone = phone
        if address and address != user.address:
            user.address = address
        if website and website != getattr(user, 'website'):
            user.website = website
        if github and github != getattr(user, 'github'):
            user.github = github
        if linkedin and linkedin != getattr(user, 'linkedin'):
            user.linkedin = linkedin
        if instagram and instagram != getattr(user, 'instagram'):
            user.instagram = instagram
        if facebook and facebook != getattr(user, 'facebook'):
            user.facebook = facebook
        if profile_picture:
            user.profile_picture = profile_picture

        # Save the updated user data
        user.save()

        # Redirect to the profile page after saving
        return redirect('profile')

    # Render the edit profile form if the request is GET
    return render(request, 'pages/edit_profile_form.html')
