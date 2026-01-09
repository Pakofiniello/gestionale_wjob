from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.


class Fornitore(models.Model):
    nome = models.CharField(max_length=200)
    partita_iva = models.CharField(max_length=50, unique=True)
    categoria = models.CharField(max_length=100)
    email = models.EmailField()
    telefono = models.CharField(max_length=50)
    indirizzo = models.TextField(blank=True)
    note = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.nome

    @property
    def initials(self):
        lettere = self.nome.split()
        return ''.join(lettere[0] for lettere in lettere[:2]).upper()
    

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
    codice_univoco = models.CharField(max_length=50, unique=True)
    categoria = models.ForeignKey(Category, on_delete=models.CASCADE)
    descrizione = models.TextField()
    prezzo = models.DecimalField(max_digits=10, decimal_places=2)
    prezzo_di_base = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock = models.IntegerField()
    fornitore = models.ForeignKey(Fornitore, on_delete=models.PROTECT, null=True, blank=True)
    ordine_riordino = models.IntegerField(default=10)
    unita_in_transito = models.IntegerField(default=0)
    location = models.CharField(max_length=100, blank=True)
    unita_vendute_mensili = models.IntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    image = models.CharField(max_length=200, blank=True)  # URL immagine
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    


class CustomUser(AbstractUser):
    
    societa = models.CharField(max_length=100, blank=True)
    role = models.CharField(max_length=50, default='user')
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    #per avatar sidebar

    @property
    def initials(self):
        first = self.first_name[0] if self.first_name else '?'
        last = self.last_name[0] if self.last_name else '?'
        return f"{first}{last}"
    

