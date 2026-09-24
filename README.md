# Nesher Inventory

Sistema de gestión de inventario para un pequeño negocio de ropa: control de
stock, colecciones, colores y tallas, con métricas de valor de inventario y
rentabilidad calculadas en tiempo real.

**Demo en vivo:** https://inven.emaconor.site

## Qué resuelve

Nació de la necesidad real de llevar el control de inventario de una tienda
(stock, precio de proveedor vs. precio de venta, categorías) sin depender de
una hoja de cálculo. Además de las operaciones CRUD típicas, calcula en el
dashboard:

- Valor total del inventario (a precio de proveedor)
- Valor potencial de venta (a precio de venta)
- Ganancia proyectada
- Productos con stock bajo o agotado

## Stack

- **Next.js 16** (App Router, Server Actions)
- **TypeScript**
- **PostgreSQL** + **Prisma 7** (con `@prisma/adapter-pg`)
- **better-auth** para autenticación (email/contraseña)
- **Cloudinary** para almacenamiento de imágenes de producto
- **react-hook-form** + **zod** para validación de formularios
- **Tailwind CSS**

## Características

- Autenticación con sesiones (better-auth), rutas protegidas por middleware
  y por verificación de sesión dentro de cada Server Action
- CRUD completo de productos, con generación automática de slugs únicos
- Gestión de colecciones, colores y tallas
- Filtros combinables (búsqueda, color, talla, colección, estado de stock)
  con debounce en la búsqueda
- Subida y reemplazo de imágenes vía Cloudinary (limpieza automática de
  imágenes huérfanas al actualizar o borrar un producto)
- Dashboard con estadísticas de inventario y rentabilidad

## Cómo correrlo localmente

### Requisitos

- Node.js 20+
- pnpm
- Una base de datos PostgreSQL (local o en la nube, p. ej. Neon/Supabase)
- Una cuenta de Cloudinary (para subida de imágenes)

### Pasos

1. Clonar el repo e instalar dependencias:

   ```bash
   git clone https://github.com/EmaConor/NesherInventory.git
   cd NesherInventory
   pnpm install
   ```

2. Crear un archivo `.env` en la raíz con:

   ```env
   DATABASE_URL="postgresql://usuario:password@host:5432/nombre_db"
   BETTER_AUTH_URL="http://localhost:3000"
   BETTER_AUTH_SECRET="una-cadena-aleatoria-larga"
   CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"
   ```

3. Aplicar las migraciones y generar el cliente de Prisma:

   ```bash
   pnpm db:migrate
   pnpm db:generate
   ```

4. Levantar el servidor de desarrollo:

   ```bash
   pnpm dev
   ```

5. Abrir [http://localhost:3000](http://localhost:3000). La primera vez te
   redirige a `/auth` para crear una cuenta.

## Estructura del proyecto

```
src/
├── actions/       # Server Actions (productos, colores, tallas, colecciones, stats)
├── app/           # Rutas (App Router): dashboard, auth
├── components/    # Componentes de UI y formularios
├── interfaces/     # Tipos compartidos
├── lib/           # Cliente de Prisma, configuración de auth
└── utils/         # Helpers (formato de moneda, slugs, hooks de auth)
```
