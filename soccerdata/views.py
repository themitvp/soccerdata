from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator

from rest_framework import viewsets, status
from rest_framework.response import Response


class IndexView(TemplateView):
    template_name = 'index.html'

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super(IndexView, self).dispatch(*args, **kwargs)


class SocialnetworkView(viewsets.ViewSet):

    def list(self, request):
        return Response({
            'status': 'Test',
            'message': 'This is a test'
        }, status=status.HTTP_200_OK)
