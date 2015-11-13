from django.conf.urls import patterns, url

from soccerdata.views import IndexView

urlpatterns = patterns(
    '',

    url('^.*$', IndexView.as_view(), name='index'),
)
