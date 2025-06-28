from django import template

register = template.Library()


@register.filter
def has_sent_request(sent_requests, user):
    return sent_requests.filter(to_user=user).exists()


@register.filter
def has_received_request(received_requests, user):
    return received_requests.filter(from_user=user).exists()


@register.filter
def get_request_id(received_requests, user):
    req = received_requests.filter(from_user=user).first()
    return req.id if req else None
