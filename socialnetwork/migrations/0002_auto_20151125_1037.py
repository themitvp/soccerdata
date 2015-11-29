# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('socialnetwork', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='linkbetweennodes',
            old_name='playing_team',
            new_name='current_team',
        ),
    ]
