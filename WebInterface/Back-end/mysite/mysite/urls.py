"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include,path

urlpatterns = [
    path('polls/', include('polls.urls')),
    path('qa1/', include('qa1.urls')),
    path('qa2/', include('qa2.urls')),
    path('qa3/', include('qa3.urls')),
    path('new1/', include('new1.urls')),
    path('new2/', include('new2.urls')),
    path('new3/', include('new3.urls')),
    path('new4/', include('new4.urls')),
    path('new5/', include('new5.urls')),
    path('new6/', include('new6.urls')),
    path('new7/', include('new7.urls')),
    path('new8/', include('new8.urls')),
    path('new9/', include('new9.urls')),
    path('new10/', include('new10.urls')),
    path('admin/', admin.site.urls),
]
