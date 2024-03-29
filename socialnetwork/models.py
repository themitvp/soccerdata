from django.db import models


class Node(models.Model):
    name = models.CharField(max_length=140, unique=True)

    current_team = models.CharField(max_length=140, null=True)
    current_team_id = models.IntegerField(null=True)
    position = models.CharField(max_length=140, null=True)
    marketvalue = models.CharField(max_length=140, null=True)
    age = models.IntegerField(null=True)

    def __unicode__(self):
        return self.name


class LinkBetweenNodes(models.Model):
    source = models.ForeignKey(Node, related_name="source")
    target = models.ForeignKey(Node, related_name="target")

    current_team = models.CharField(max_length=140, null=True)
    current_team_id = models.IntegerField(null=True)
    value = models.IntegerField()

    def __unicode__(self):
        return ' '.join([self.source.name, self.target.name])
