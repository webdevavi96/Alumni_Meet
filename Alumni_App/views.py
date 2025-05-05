from django.shortcuts import render, HttpResponse, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth.hashers import make_password
from datetime import datetime
from .models import Blog, Event, Alumni, Teacher, Student, CustomUser




def home(request):
    return render(request, 'index.html')


@login_required
def blogs(request):
    blogData = Blog.objects.all()
    user = request.user
    return render(request, 'Pages/blogs.html', {"blogData": blogData, 'user': user})


@login_required
def events(request):
    eventData = Event.objects.all()
    current_datetime = datetime.now()
    for event in eventData:
        event_datetime = datetime.combine(event.date, event.time)
        if event_datetime > current_datetime:
            event.status = "Upcoming"
        elif event_datetime == current_datetime:
            event.status = "Ongoing"
        else:
            event.status = "Ended"

    return render(request, 'pages/events.html', {'eventData': eventData})


@login_required
def profile(request):
    user = request.user
    students = Student.objects.all()
    return render(request, 'Pages/profile.html', {'user': user, 'students': students})




def login(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        user = authenticate(request, email=email, password=password)
        if user is not None:
            auth_login(request, user)
            return redirect("profile")
            
        else:
             return HttpResponse("Invalid credentials")

    return render(request, "Pages/signIn.html")


def logout(request):
    request.session.flush()
    return redirect("login")


def signUp(request):
    if request.method == "POST":
        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")
        email = request.POST.get("email")
        phone = request.POST.get("phone")
        user_type = request.POST.get("user_type")
        branch = request.POST.get("branch")
        password = request.POST.get("password")
        confirm_password = request.POST.get("confirm_password")

        if password != confirm_password:
            return HttpResponse("Passwords do not match.")
        
        user = CustomUser.objects.create(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            user_type=user_type,
            password=make_password(password),
        )

        if user_type == "alumni":
            Alumni.objects.create(user=user)
        elif user_type == "teacher":
            Teacher.objects.create(user=user)
        elif user_type == "student":
            Student.objects.create(user=user, branch=branch)

        return redirect("login")

    return render(request, "Pages/signUp.html")


def details(request, slug):
    try:
        blog = Blog.objects.get(slug=slug)
    except Blog.DoesNotExist:
        return HttpResponse("Blog not found")

    return render(request, 'Pages/details.html', {'blog': blog})

def new_blog(request):
    if request.method == "POST":
        title = request.POST.get("title")
        content = request.POST.get("content")
        image = request.FILES.get("image")

        blog = Blog.objects.create(
            title=title,
            content=content,
            blog_image=image,
            author=request.user
        )
        return redirect("blogs")

    return render(request, 'Pages/new_blog.html')

def new_event(request):
    if request.method == "POST":
        title = request.POST.get("title")
        description = request.POST.get("description")
        date = request.POST.get("date")
        time = request.POST.get("time")

        event = Event.objects.create(
            title=title,
            description=description,
            date=date,
            time=time,
            author=request.user 
        )
        return redirect("events")

    return render(request, 'Pages/new_event.html')

@login_required
def delete_blog(request, slug):
    try:
        blog = Blog.objects.get(slug=slug)

        if blog.author == request.user:
            blog.delete()
            return redirect("blogs")
        
    except Blog.DoesNotExist:
        return HttpResponse("Blog not found.", status=404)
    
@login_required
def delete_event(request, slug):
    try:
        event = Event.objects.get(slug=slug)

        if event.author == request.user:
            event.delete()
            return redirect("events")
        
    except Event.DoesNotExist:
        return HttpResponse("Event not found.", status=404)