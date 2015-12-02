from rest_framework import viewsets, status
from rest_framework.response import Response

from socialnetwork.models import Node, LinkBetweenNodes
from socialnetwork.serializers import NodeSerializer, LinkSerializer
import csv
import os


class SocialnetworkView(viewsets.ViewSet):
    nodes_list = Node.objects.all()[:1000]
    links_list = LinkBetweenNodes.objects.all()[:50000]

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
    queryset = Node.objects.all()[:100]
    nodeSerializer = NodeSerializer

    def list(self, request, name=None):
        queryset = self.queryset.filter(name=name)
        nodes_serialized = self.nodeSerializer(queryset)
        return Response(nodes_serialized.data, status=status.HTTP_200_OK)


class CommunitiesView(viewsets.ViewSet):
    def list(self, request):
        module_dir = os.path.dirname(__file__)  # get current directory
        file_path = os.path.join(module_dir, 'out.csv')

        f = open(file_path)

        csv_f = csv.reader(f, delimiter=",")
        data = []
        for row in csv_f:
            row_data = {}
            row_data['region'] = row[0]
            row_data['nation'] = row[1]
            for i in range(2, 24):
                row_data['c' + str(i-1)] = row[i]
            row_data['total'] = row[24]
            data.append(row_data)

        return Response(data, status=status.HTTP_200_OK)
