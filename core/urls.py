from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('', views.dashboard, name='dashboard'),
    path('products/', views.products, name='products'),
    path('inventory/', views.inventory, name='inventory'),
    path('orders/', views.orders, name='orders'),
    path('suppliers/', views.suppliers, name='suppliers'),
    path('reports/', views.reports, name='reports'),
]
