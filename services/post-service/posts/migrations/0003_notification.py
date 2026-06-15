from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0002_like'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('recipient_id', models.IntegerField()),
                ('actor_id', models.IntegerField()),
                ('actor_username', models.CharField(max_length=50)),
                ('notification_type', models.CharField(max_length=20)),
                ('message', models.CharField(max_length=255)),
                ('is_read', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to='posts.post')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
