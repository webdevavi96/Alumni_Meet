from django.shortcuts import render, get_object_or_404
from Alumni_App.models import CustomUser
from .models import Community

def mainPage(request):
    users =CustomUser.objects.all().exclude(id=request.user.id)
    chat_user=None
    return render(request, 'master.html',{
        'users':users,
        'chat_user':chat_user,
        'chat':True
    })

# Chat Detail View
def chat(request, user_id):
    users = CustomUser.objects.exclude(id=request.user.id)
    chat_user = get_object_or_404(CustomUser, id=user_id)

    return render(request, 'master.html', {'users': users, 'chat_user': chat_user})


def community_page(request):
    communities = Community.objects.all()
    selected_id = request.GET.get("id")
    selected_community = None

    if selected_id:
        selected_community = get_object_or_404(Community, id=selected_id)

    return render(request, 'pages/community.html', {
        'communities': communities,
        'selected_community': selected_community,
    })

# Settings Page
def settings(request):
    return render(request, 'pages/settings.html')
