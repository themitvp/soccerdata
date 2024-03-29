from django.conf.urls import patterns, url, include
from rest_framework_nested import routers
from soccerdata.views import IndexView
from socialnetwork.views import SocialnetworkView, NodesView, CommunitiesView

router = routers.SimpleRouter()
router.register(r'socialnetwork', SocialnetworkView, base_name="socialnetwork")
router.register(r'nodes', NodesView, base_name="nodes")
router.register(r'communities', CommunitiesView, base_name="communities")

urlpatterns = patterns(
    '',
    url(r'^api/v1/', include(router.urls)),
    url('^.*$', IndexView.as_view(), name='index'),
)
