# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='LinkBetweenNodes',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('value', models.IntegerField()),
                ('playing_team', models.CharField(max_length=140, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Node',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=140)),
                ('current_team', models.CharField(max_length=140, blank=True)),
                ('position', models.CharField(max_length=140, blank=True)),
                ('marketvalue', models.CharField(max_length=140, blank=True)),
                ('age', models.IntegerField(blank=True)),
            ],
        ),
        migrations.AddField(
            model_name='linkbetweennodes',
            name='source',
            field=models.ForeignKey(related_name='source', to='socialnetwork.Node'),
        ),
        migrations.AddField(
            model_name='linkbetweennodes',
            name='target',
            field=models.ForeignKey(related_name='target', to='socialnetwork.Node'),
        ),
    ]
