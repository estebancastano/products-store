# Products Store - Angular App

Este proyecto es una **tienda de productos** desarrollada con **Angular 20**, **Angular Material**, y **TypeScript**. Permite visualizar, crear y detallar productos, con un diseño responsivo y moderno.

---

## 🔹 Características

- Listado de productos en **tarjetas** con imagen, título, precio, marca, rating y categoría.
- Vista de detalle de producto con galería de imágenes, descripción, stock, categoría, descuento, rating y el botón de eliminar.
- Formulario para crear nuevos productos con validación.
- Navegación a través de un **navbar responsivo**.
- Interfaz atractiva con animaciones y efectos hover.
- Soporte completo para **pantallas pequeñas** (responsive design).

---

## 📁 Repositorio

Repositorio público: [https://github.com/estebancastano/products-store](https://github.com/estebancastano/products-store)

---

## ⚙️ Requisitos

- Node.js >= 20
- Angular CLI >= 20
- NPM o Yarn
- Git

---

## 🚀 Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/estebancastano/products-store.git
cd products-store

```
2. Instalar dependencias:

```bash
npm install
# o
yarn install
```
3. Iniciar la aplicación:

```bash
ng serve
```
Abrir en el navegador:
```
http://localhost:4200
```

---
## 🖼️ Capturas / Demo

### Vista de todos los productos:
  <img width="1887" height="899" alt="image" src="https://github.com/user-attachments/assets/8fd09fe4-2913-4cd0-a781-566bb9018a20" />
  
### Vista detallada de un producto:
  <img width="1631" height="784" alt="image" src="https://github.com/user-attachments/assets/ebafe562-d3e7-41e1-ab9a-a6413483274b" />
  <img width="1565" height="814" alt="image" src="https://github.com/user-attachments/assets/88840ddf-046f-49e9-9bb0-70b25a11885b" />
  
### Vista de agregar producto:
  <img width="1894" height="908" alt="image" src="https://github.com/user-attachments/assets/dc0cac1c-99a0-427c-b095-06b02dc9426b" />


- Deploy: [https://products-store-kappa.vercel.app](https://products-store-kappa.vercel.app/products)

---

## ✨ Buenas prácticas aplicadas
- Uso de Angular Material para componentes UI.

- Navegación mediante RouterLink y RouterOutlet.

- Flexbox y Grid para diseño responsivo.

- Animaciones y efectos hover en botones y tarjetas.

- Utilicé switchMap, combineLatest, shareReplay para el manejo de los observables y llamar a la API.

- También apliqué ChangeDetection OnPush para el manejo de recarga de solo los componentes que lo tuvieran y no toda la app.  

- Separación de estilos por componente.
