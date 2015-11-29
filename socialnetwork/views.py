from rest_framework import viewsets, status
from rest_framework.response import Response

from socialnetwork.models import Node, LinkBetweenNodes
from socialnetwork.serializers import NodeSerializer, LinkSerializer


class SocialnetworkView(viewsets.ViewSet):
    nodes_list = Node.objects.all()[:10]
    links_list = LinkBetweenNodes.objects.all()[:500]

    nodeSerializer = NodeSerializer
    linkSerializer = LinkSerializer

    def list(self, request):
        nodes_serialized = self.nodeSerializer(self.nodes_list, many=True)
        links_serialized = self.linkSerializer(self.links_list, many=True)

        merged = {
            'nodes': nodes_serialized.data,
            'links': links_serialized.data
        }

        return Response(merged, status=status.HTTP_200_OK)


class NodesView(viewsets.ViewSet):
    nodes_list = Node.objects.all()[:100]
    nodeSerializer = NodeSerializer

    def list(self, request):
        nodes_serialized = self.nodeSerializer(self.nodes_list, many=True)
        return Response(nodes_serialized.data, status=status.HTTP_200_OK)
