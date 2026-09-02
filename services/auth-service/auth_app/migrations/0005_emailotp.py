from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth_app', '0004_notification'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmailOTP',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(db_index=True, max_length=254)),
                ('otp', models.CharField(max_length=6)),
                ('created_at', models.DateTimeField(auto_now=True)),
                ('is_verified', models.BooleanField(default=False)),
            ],
            options={
                'verbose_name': 'Email OTP',
                'verbose_name_plural': 'Email OTPs',
                'ordering': ['-created_at'],
            },
        ),
    ]
