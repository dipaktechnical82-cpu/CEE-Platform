from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

User = get_user_model()


class UserSummarySerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(source='full_name', read_only=True)
    isEmailVerified = serializers.BooleanField(source='is_email_verified', read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'fullName', 'role', 'isEmailVerified', 'createdAt')
        read_only_fields = fields


class RegistrationSerializer(serializers.Serializer):
    fullName = serializers.CharField(source='full_name', max_length=255, trim_whitespace=True)
    email = serializers.EmailField(max_length=254)
    password = serializers.CharField(write_only=True, trim_whitespace=False, max_length=128)
    passwordConfirmation = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
        max_length=128,
    )

    def validate_email(self, value):
        normalized = value.strip().casefold()
        if User.objects.filter(email__iexact=normalized).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return normalized

    def validate(self, attrs):
        if attrs['password'] != attrs['passwordConfirmation']:
            raise serializers.ValidationError(
                {'passwordConfirmation': 'Passwords do not match.'}
            )
        candidate = User(email=attrs['email'], full_name=attrs['full_name'])
        try:
            validate_password(attrs['password'], user=candidate)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({'password': exc.messages}) from exc
        return attrs

    def create(self, validated_data):
        validated_data.pop('passwordConfirmation')
        password = validated_data.pop('password')
        return User.objects.create_user(
            password=password,
            role=User.Role.STUDENT,
            is_email_verified=False,
            **validated_data,
        )


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=254)
    password = serializers.CharField(write_only=True, trim_whitespace=False, max_length=128)

    def validate_email(self, value):
        return value.strip().casefold()


class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=254)

    def validate_email(self, value):
        return value.strip().casefold()


class VerifyEmailSerializer(serializers.Serializer):
    token = serializers.CharField(write_only=True, trim_whitespace=False)


class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField(write_only=True, trim_whitespace=False)
    password = serializers.CharField(write_only=True, trim_whitespace=False, max_length=128)
    passwordConfirmation = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
        max_length=128,
    )

    def validate(self, attrs):
        if attrs['password'] != attrs['passwordConfirmation']:
            raise serializers.ValidationError(
                {'passwordConfirmation': 'Passwords do not match.'}
            )
        return attrs
