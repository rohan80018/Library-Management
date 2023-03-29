from rest_framework import serializers
# from django.shortcuts import get_object_or_404
from .models import Books, Member, Issue_Book


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Books
        fields = "__all__"
    
    def update(self, instance, validate_data):
        if validate_data.get('quantity'):
            instance.quantity += validate_data.get('quantity')
        else:
            instance.quantity += 1
        instance.save()
        return instance   


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = "__all__"
    
    def update(self, instance, validated_data, *args):
        instance.name = validated_data.get('name')
        instance.phone = validated_data.get('phone')
        instance.address = validated_data.get('address')
        instance.age = validated_data.get('age')
        instance.save()
        return instance
    
class Issue_BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue_Book
        fields ="__all__"