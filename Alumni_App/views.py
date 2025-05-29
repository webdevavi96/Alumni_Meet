from django.shortcuts import render, HttpResponse, redirect
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth.hashers import make_password
from .models import Blog, Event, Alumni, Teacher, Student, CustomUser
from django.http import JsonResponse
from django.core.mail import send_mail
from datetime import datetime, timedelta
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import Group
import random
import json
CustomUser = get_user_model()



def home(request):
    return render(request, 'index.html')



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
        # Get form data
        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")
        email = request.POST.get("email")
        phone = request.POST.get("phone")
        user_type = request.POST.get("user_type")
        branch = request.POST.get("branch")
        password = request.POST.get("password")
        confirm_password = request.POST.get("confirm_password")

        # Password check
        if password != confirm_password:
            return render(request, "Pages/signUp.html", {"error": "Passwords do not match."})

        # Check email uniqueness
        if CustomUser.objects.filter(email=email).exists():
            return render(request, "Pages/signUp.html", {"error": "Email already registered."})

        # Generate OTP
        otp = str(random.randint(100000, 999999))

        # Store data in session
        request.session['temp_user'] = {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "phone": phone,
            "user_type": user_type,
            "branch": branch,
            "password": password,  # store raw password temporarily (be cautious)
        }
        request.session['otp'] = otp
        request.session['otp_time'] = datetime.now().isoformat()

        # Send OTP email
        send_mail(
            "Your OTP for Signup",
            f"Hello {first_name}, your OTP is: {otp}",
            "mmitcse3@gmail.com",  # Change to your verified email
            [email],
            fail_silently=False,
        )

        # Render OTP verification page
        return render(request, "Pages/verify_otp.html", {"email": email})

    return render(request, "Pages/signUp.html")


@csrf_exempt
def verify_otp_ajax(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_otp = data.get("otp")

        session_otp = request.session.get("otp")
        otp_time_str = request.session.get("otp_time")
        temp_user = request.session.get("temp_user")

        if not (session_otp and otp_time_str and temp_user):
            return JsonResponse({"status": "error", "message": "Session expired or invalid."})

        otp_time = datetime.fromisoformat(otp_time_str)
        now = datetime.now()

        # OTP expiry: 5 minutes
        if now - otp_time > timedelta(minutes=5):
            return JsonResponse({"status": "error", "message": "OTP expired. Please signup again."})

        if user_otp == session_otp:
            # Create user
            user = CustomUser.objects.create_user(
                username=temp_user['email'],
                first_name=temp_user['first_name'],
                last_name=temp_user['last_name'],
                email=temp_user['email'],
                phone=temp_user['phone'],
                user_type=temp_user['user_type'],
                password=temp_user['password'],
                group_name = temp_user['user_type'],
            )

         
         
            if temp_user['user_type'] == "alumni":
                Alumni.objects.create(user=user)
            elif temp_user['user_type'] == "teacher":
                Teacher.objects.create(user=user)
            elif temp_user['user_type'] == "student":
                Student.objects.create(user=user, branch=temp_user['branch'])
            try:
                group = Group.objects.get(name=group_name)
                user.groups.add(group)
            except Group.DoesNotExist:
                 pass
          
            request.session.flush()

            return JsonResponse({"status": "success"})

        else:
            return JsonResponse({"status": "error", "message": "Invalid OTP."})

    return JsonResponse({"status": "error", "message": "Invalid request method."})


@csrf_exempt
def resend_otp(request):
    if request.method == "POST":
        temp_user = request.session.get("temp_user")
        if not temp_user:
            return JsonResponse({"status": "error", "message": "Session expired. Please signup again."})

        new_otp = str(random.randint(100000, 999999))
        request.session['otp'] = new_otp
        request.session['otp_time'] = datetime.now().isoformat()

        try:
            send_mail(
                "Your New OTP for Signup",
                f"Hello {temp_user['first_name']}, your new OTP is: {new_otp}",
                "mmitcse3@gmail.com",  # change this!
                [temp_user['email']],
                fail_silently=False,
            )
        except Exception as e:
            return JsonResponse({"status": "error", "message": f"Failed to send OTP email: {e}"})

        return JsonResponse({"status": "success", "message": "OTP resent successfully."})

    return JsonResponse({"status": "error", "message": "Invalid request method."})

@csrf_exempt
def varify_otp(request):
    return render(request, "Pages/varify_otp.html")

@login_required
def blogs(request):
    blogData = Blog.objects.all()
    user = request.user
    return render(request, 'Pages/blogs.html', {"blogData": blogData, 'user': user})



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
        if request.headers.get('x-requested-with') == 'XMLHttpRequest' or request.META.get('HTTP_ACCEPT') == 'application/json':
            return JsonResponse({
                "success": True,
                "blog": {
                    "title": blog.title,
                    "content": blog.content,
                    "author": blog.author.get_full_name(),
                    "slug": blog.slug,
                    "image_url": blog.blog_image.url if blog.blog_image else "",
                }
            })
        send_blog_notification(blog, request)
        return redirect("blogs")
    return render(request, 'Pages/new_blog.html')

@login_required
def delete_blog(request, slug):
    try:
        blog = Blog.objects.get(slug=slug)

        if blog.author == request.user:
            blog.delete()
            return redirect("blogs")
        
    except Blog.DoesNotExist:
        return HttpResponse("Blog not found.", status=404)
 
def latest_blog(request):
        latest_blog = Blog.objects.order_by('-created_at').first()
        if latest_blog:
            return JsonResponse({
            "success": True,
            "blog": {
                "id": latest_blog.id,
                "title": latest_blog.title,
                "content": latest_blog.content,
                "author": latest_blog.author.get_full_name(),
                "slug": latest_blog.slug,
                "image_url": latest_blog.blog_image.url if latest_blog.blog_image else "",
            }
            })
        else:
             return JsonResponse({"success": False, "error": "No blogs found."}, status=404)


@login_required
def events(request):
    eventData = Event.objects.all()
    current_datetime = datetime.now()
    
    for event in eventData:
        event_datetime = datetime.combine(event.date, event.time)
        if event_datetime > current_datetime:
            event.status = "Upcoming"
        elif event_datetime <= current_datetime < event_datetime + timedelta(minutes=30):
            event.status = "Ongoing"
        else:
            event.status = "Ended"

    return render(request, 'pages/events.html', {'eventData': eventData})


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
        send_event_notification(event)
        return redirect("events")
       
    return render(request, 'Pages/new_event.html')

   
@login_required
def delete_event(request, slug):
    try:
        event = Event.objects.get(slug=slug)

        if event.author == request.user:
            event.delete()
            return redirect("events")
        
    except Event.DoesNotExist:
        return HttpResponse("Event not found.", status=404)




def send_event_notification(event):
    subject = f"New Event: {event.title}"
    message = f"Hello,\n\nA new event has been created:\n\nTitle: {event.title}\nDate: {event.date}\nTime: {event.time}\n\nDescription:\n{event.description}\n\nDon't miss it!"
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email for user in CustomUser.objects.all() if user.email]

    send_mail(subject, message, from_email, recipient_list)

def send_blog_notification(blog, request):
    blog_url = request.build_absolute_uri(f'/blogs/{blog.slug}/')
    subject = f"New Blog: {blog.title}"
    message = f"""Hello,
        A new blog has been posted:
        Title: {blog.title}
        Description: {blog.content}
        Author: {blog.author.get_full_name()}
        Don't miss it!
        View Blog: {blog_url}
        """
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email for user in CustomUser.objects.all() if user.email]

    send_mail(subject, message, from_email, recipient_list)
    
    
