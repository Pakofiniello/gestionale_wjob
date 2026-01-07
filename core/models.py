from django.db import models

# Create your models here.



class Category(models.Model):

    nome_categoria = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Nome Categoria"
    )
    
    descrizione_categoria = models.TextField(
        blank=True,
        verbose_name="Descrizione Categoria"
    )
    
    class Meta:
        verbose_name = "Categoria"
        verbose_name_plural = "Categorie"
        ordering = ['nome_categoria']
    
    def __str__(self):
        return self.nome_categoria
    


class Product(models.Model):
    name = models.CharField(max_length=100)
    sku = models.CharField(max_length=50, unique=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock = models.IntegerField()
    reorder_level = models.IntegerField(default=10)
    units_in_transit = models.IntegerField(default=0)
    location = models.CharField(max_length=100, blank=True)
    units_sold_month = models.IntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    image = models.CharField(max_length=200, blank=True)  # URL immagine
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name