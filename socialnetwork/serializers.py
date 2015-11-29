from rest_framework import serializers
from socialnetwork.models import Node, LinkBetweenNodes


class NodeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Node
        fields = (
            'id',
            'name',
            'current_team',
            'position',
            'marketvalue',
            'age')


class LinkSerializer(serializers.ModelSerializer):

    class Meta:
        model = LinkBetweenNodes
        fields = (
            'source',
            'target',
            'current_team',
            'value')
