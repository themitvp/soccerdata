# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('socialnetwork', '0002_auto_20151125_1037'),
    ]

    operations = [
        migrations.AddField(
            model_name='linkbetweennodes',
            name='current_team_id',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='node',
            name='current_team_id',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='linkbetweennodes',
            name='current_team',
            field=models.CharField(max_length=140, null=True),
        ),
        migrations.AlterField(
            model_name='node',
            name='age',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='node',
            name='current_team',
            field=models.CharField(max_length=140, null=True),
        ),
        migrations.AlterField(
            model_name='node',
            name='marketvalue',
            field=models.CharField(max_length=140, null=True),
        ),
        migrations.AlterField(
            model_name='node',
            name='position',
            field=models.CharField(max_length=140, null=True),
        ),
    ]
