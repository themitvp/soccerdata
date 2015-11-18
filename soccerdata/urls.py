from django.conf.urls import patterns, url, include
from rest_framework_nested import routers
from soccerdata.views import IndexView, SocialnetworkView

router = routers.SimpleRouter()
router.register(r'socialnetwork', SocialnetworkView, base_name="socialnetwork")

urlpatterns = patterns(
    '',
    url(r'^api/v1/', include(router.urls)),
    url('^.*$', IndexView.as_view(), name='index'),
)
