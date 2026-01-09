from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.index, name='index'),
    path('shop/', views.shop, name='shop'),
    path('cart/', views.cart, name='cart'),
    path('checkout/', views.checkout, name='checkout'),
    
    path('login/', views.user_login, name='user_login'),
    path('register/', views.register, name='register'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('products/', views.products, name='products'),
    path('inventory/', views.inventory, name='inventory'),
    path('orders/', views.orders, name='orders'),
    path('suppliers/', views.suppliers, name='suppliers'),
    path('reports/', views.reports, name='reports'),
    path('logout/', views.logout_view, name='logout_view'),
    path('api/add-to-cart/', views.add_to_cart, name='add_to_cart'),
    path('api/remove-from-cart/', views.remove_from_cart, name='remove_from_cart'),
    path('api/update-cart/', views.update_cart, name='update_cart'),
]
