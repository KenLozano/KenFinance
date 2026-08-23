 # 🚀 Deployment — KenFinance v1.0

> Guía de despliegue correspondiente al estado final de **KenFinance v1.0 / Fase 1**.

**Versión:** 1.0.0  
**Frontend:** HTML + CSS + JavaScript ES Modules  
**Backend:** Firebase Authentication + Cloud Firestore  
**Hosting principal:** Vercel  
**Hosting alternativo configurado:** Firebase Hosting  
**PWA:** Sí  

---

# 📑 Índice

1. [Objetivo](#1-objetivo)
2. [Arquitectura de despliegue](#2-arquitectura-de-despliegue)
3. [Archivos de configuración involucrados](#3-archivos-de-configuración-involucrados)
4. [Requisitos previos](#4-requisitos-previos)
5. [Verificación local antes del despliegue](#5-verificación-local-antes-del-despliegue)
6. [Despliegue principal en Vercel](#6-despliegue-principal-en-vercel)
7. [Configuración actual de Vercel](#7-configuración-actual-de-vercel)
8. [Firebase utilizado por producción](#8-firebase-utilizado-por-producción)
9. [Firebase Authentication](#9-firebase-authentication)
10. [Cloud Firestore](#10-cloud-firestore)
11. [Firestore Rules e índices](#11-firestore-rules-e-índices)
12. [Firebase Hosting como alternativa](#12-firebase-hosting-como-alternativa)
13. [PWA en producción](#13-pwa-en-producción)
14. [Service Worker y caché](#14-service-worker-y-caché)
15. [Manifest](#15-manifest)
16. [Encabezados de seguridad](#16-encabezados-de-seguridad)
17. [Actualización de producción](#17-actualización-de-producción)
18. [Rollback](#18-rollback)
19. [Checklist posterior al despliegue](#19-checklist-posterior-al-despliegue)
20. [Problemas comunes](#20-problemas-comunes)
21. [Netlify y `_redirects`](#21-netlify-y-_redirects)
22. [Estado del despliegue v1.0](#22-estado-del-despliegue-v10)

---

# 1. Objetivo

Este documento explica cómo ejecutar y desplegar **KenFinance v1.0** utilizando la configuración existente al cierre de la Fase 1.

La guía documenta únicamente la arquitectura actual:

```text
GitHub
   │
   ▼
Vercel
   │
   ▼
KenFinance Web / PWA
   │
   ├── Firebase Authentication
   └── Cloud Firestore
```

No documenta migraciones o tecnologías previstas para versiones posteriores.

---

# 2. Arquitectura de despliegue

KenFinance v1.0 es una aplicación frontend estática.

No existe un servidor Node.js propio en producción.

```text
Repositorio GitHub
       │
       ▼
     Vercel
       │
       ▼
HTML + CSS + JavaScript
       │
       ▼
Firebase
├── Authentication
└── Cloud Firestore
```

Vercel publica los archivos del frontend.

Firebase proporciona autenticación y persistencia de datos.

---

# 3. Archivos de configuración involucrados

Los principales archivos relacionados con despliegue son:

```text
vercel.json
firebase.json
.firebaserc
firestore.rules
firestore.indexes.json
manifest.json
service-worker.js
js/firebase/runtime-config.js
```

También existe:

```text
_redirects
```

correspondiente a compatibilidad con despliegues alternativos como Netlify.

---

# 4. Requisitos previos

Para trabajar localmente se recomienda disponer de:

```text
Git
Node.js
npm
navegador moderno
```

Para administrar el despliegue también se requiere acceso autorizado a:

```text
Repositorio GitHub de KenFinance
Proyecto Vercel
Proyecto Firebase
```

---

# 5. Verificación local antes del despliegue

Antes de publicar cambios:

## Instalar herramientas del proyecto

```bash
npm install
```

## Ejecutar KenFinance localmente

```bash
npm run dev
```

El proyecto utiliza un servidor estático mediante:

```text
npx -y serve .
```

## Ejecutar lint

```bash
npm run lint
```

Antes de desplegar conviene comprobar manualmente:

```text
Login
Registro
Google Login
Recuperación de contraseña
Perfil
Cuentas
Ingresos
Gastos
Edición
Eliminación
Filtros
Gráficos
Excel
PDF
Tema claro/oscuro
PWA
```

---

# 6. Despliegue principal en Vercel

Vercel es el hosting principal utilizado por KenFinance v1.0.

## Flujo recomendado

```text
Cambios locales
      │
      ▼
Commit
      │
      ▼
Push a GitHub
      │
      ▼
Vercel detecta cambios
      │
      ▼
Nuevo deployment
```

## Importación inicial

Al importar el repositorio en Vercel:

```text
Framework Preset: Other
Root Directory: ./
```

KenFinance v1.0 no requiere un proceso de compilación frontend.

La aplicación se sirve directamente desde los archivos existentes en el repositorio.

No existe una carpeta `dist/` generada para esta versión.

---

# 7. Configuración actual de Vercel

El archivo:

```text
vercel.json
```

contiene la configuración utilizada por el despliegue.

## Rewrite SPA

Todas las rutas se redirigen a:

```text
/index.html
```

Conceptualmente:

```text
/(.*)
   ↓
/index.html
```

Esto permite mantener el comportamiento de aplicación de una sola página.

---

## Caché

`index.html` y `service-worker.js` utilizan:

```text
Cache-Control:
no-cache, no-store, must-revalidate
```

Esto evita conservar versiones antiguas de estos dos archivos críticos.

---

## Encabezados

Vercel configura encabezados de seguridad como:

```text
X-Content-Type-Options
X-Frame-Options
Referrer-Policy
Permissions-Policy
Content-Security-Policy
```

Los detalles se encuentran centralizados en `vercel.json`.

---

# 8. Firebase utilizado por producción

La configuración Firebase utilizada por KenFinance se encuentra en:

```text
js/firebase/runtime-config.js
```

El proyecto configurado actualmente utiliza:

```text
Project ID:
konteo-fiance
```

El mismo proyecto aparece como proyecto predeterminado en:

```text
.firebaserc
```

Por tanto:

```text
runtime-config.js
        │
        └── konteo-fiance

.firebaserc
        │
        └── konteo-fiance
```

deben permanecer coherentes.

---

# 9. Firebase Authentication

KenFinance utiliza Firebase Authentication para:

```text
Email + contraseña
Google
Recuperación de contraseña
Sesión de usuario
```

Después de desplegar en un dominio nuevo, debe comprobarse que ese dominio esté autorizado en la configuración de Firebase Authentication.

Si el dominio no está permitido, determinadas operaciones de autenticación pueden fallar.

---

# 10. Cloud Firestore

Cloud Firestore almacena los datos de KenFinance.

Entre ellos:

```text
usuarios
perfil
cuentas/assets
ingresos
gastos
plan financiero
```

La configuración del frontend apunta al proyecto Firebase definido en `runtime-config.js`.

---

# 11. Firestore Rules e índices

Los archivos:

```text
firestore.rules
firestore.indexes.json
```

se encuentran asociados desde:

```text
firebase.json
```

mediante:

```text
firestore:
  rules   → firestore.rules
  indexes → firestore.indexes.json
```

Cuando se realizan cambios en reglas o índices, deben desplegarse explícitamente mediante Firebase CLI.

## Desplegar reglas

```bash
firebase deploy --only firestore:rules
```

## Desplegar índices

```bash
firebase deploy --only firestore:indexes
```

## Desplegar ambos

```bash
firebase deploy --only firestore
```

Las reglas de Firestore forman parte de la seguridad real de la aplicación y deben revisarse antes de considerar un release completamente cerrado.

---

# 12. Firebase Hosting como alternativa

Aunque Vercel es el hosting principal de v1.0, el repositorio también mantiene configuración para Firebase Hosting.

El archivo:

```text
firebase.json
```

utiliza:

```text
public: "."
```

Por tanto Firebase Hosting puede servir directamente la raíz del proyecto.

---

## Archivos ignorados por Firebase Hosting

La configuración excluye, entre otros:

```text
firebase.json
firestore.rules
firestore.indexes.json
README.md
DEPLOYMENT.md
GUIA_TECNICA_COMPLETA.md
vercel.json
_redirects
node_modules
archivos ocultos
```

---

## Rewrite

Firebase Hosting también redirige todas las rutas hacia:

```text
/index.html
```

manteniendo el comportamiento SPA.

---

## Despliegue mediante Firebase Hosting

Después de autenticar Firebase CLI:

```bash
firebase login
```

puede comprobarse el proyecto actual:

```bash
firebase use
```

El proyecto predeterminado debe corresponder a:

```text
konteo-fiance
```

Para desplegar únicamente Hosting:

```bash
firebase deploy --only hosting
```

Firebase Hosting se mantiene como alternativa y no como hosting principal de KenFinance v1.0.

---

# 13. PWA en producción

KenFinance v1.0 incluye soporte PWA mediante:

```text
manifest.json
service-worker.js
icons/
```

Para que la instalación funcione correctamente, producción debe utilizar:

```text
HTTPS
```

Vercel proporciona HTTPS para los deployments publicados.

---

# 14. Service Worker y caché

El Service Worker actual utiliza:

```text
CACHE_NAME = KenFinance-v1.0.0
```

y precarga recursos principales de la aplicación.

Entre ellos:

```text
/
index.html
css/styles.css
manifest.json
js/app.js
js/state.js
módulos Firebase
servicios principales
módulos UI
iconos principales
```

---

## Estrategia de navegación

Para solicitudes de navegación:

```text
Network first
        │
        └── si falla
              ↓
          /index.html
```

Esto permite que la aplicación pueda seguir abriendo su interfaz básica cuando la red no responde y los recursos necesarios ya están disponibles.

---

## Recursos estáticos

Para otros recursos GET:

```text
Cache first
    │
    └── si no existe
          ↓
       Network
```

---

## Firebase

Las solicitudes detectadas como relacionadas con Firebase no se interceptan mediante esta estrategia de caché.

Esto evita tratar las comunicaciones con Firebase como archivos estáticos.

---

## Actualización de caché

Cuando cambia el nombre:

```text
KenFinance-v1.0.0
```

el Service Worker puede eliminar caches anteriores durante `activate`.

Si se realizan cambios importantes a los recursos precargados, debe considerarse actualizar la versión de `CACHE_NAME`.

---

# 15. Manifest

El archivo:

```text
manifest.json
```

define la identidad PWA.

Actualmente utiliza:

```text
name:
KenFinance — Mis Finanzas

short_name:
KenFinance

display:
standalone

orientation:
portrait-primary
```

También incluye accesos rápidos para:

```text
Nuevo Ingreso
Nuevo Gasto
```

y los iconos desde:

```text
72×72
```

hasta:

```text
512×512
```

---

# 16. Encabezados de seguridad

Vercel y Firebase Hosting contienen configuraciones equivalentes para varios encabezados.

Entre ellos:

## MIME sniffing

```text
X-Content-Type-Options: nosniff
```

## Embedding en frames

```text
X-Frame-Options: DENY
```

## Referrer Policy

```text
Referrer-Policy:
strict-origin-when-cross-origin
```

## Permissions Policy

Actualmente se bloquea el acceso web a:

```text
camera
microphone
geolocation
usb
```

## Content Security Policy

La CSP limita:

```text
scripts
estilos
fuentes
imágenes
conexiones
workers
frames
objetos
formularios
```

y permite los dominios necesarios para Firebase y las bibliotecas utilizadas por KenFinance v1.0.

---

# 17. Actualización de producción

Para publicar una nueva modificación del frontend:

```bash
git add .
git commit -m "tipo: descripción"
git push
```

Si Vercel continúa conectado al repositorio y rama de producción, se generará un nuevo deployment.

Antes del push se recomienda:

```bash
npm run lint
```

y una prueba funcional local.

---

## Cambios Firebase

Los cambios del frontend publicados en Vercel **no despliegan automáticamente**:

```text
firestore.rules
firestore.indexes.json
```

Cuando se modifican estos archivos debe utilizarse Firebase CLI.

Ejemplo:

```bash
firebase deploy --only firestore
```

---

# 18. Rollback

Vercel conserva deployments anteriores del proyecto.

Si una publicación introduce un error, puede utilizarse un deployment anterior estable desde el panel de Vercel.

También puede revertirse el cambio en Git:

```bash
git revert <commit>
git push
```

La estrategia elegida dependerá del tipo de incidencia.

---

# 19. Checklist posterior al despliegue

Después de publicar una versión debe comprobarse:

```text
[ ] La página carga mediante HTTPS
[ ] No aparecen errores críticos en consola
[ ] Login por email funciona
[ ] Login Google funciona
[ ] Logout funciona
[ ] Perfil carga correctamente
[ ] Firestore puede leer datos autorizados
[ ] Firestore puede guardar datos autorizados
[ ] Crear cuenta funciona
[ ] Registrar ingreso funciona
[ ] Registrar gasto funciona
[ ] Editar movimiento funciona
[ ] Eliminar movimiento funciona
[ ] Saldo de cuentas se recalcula
[ ] Gráficos cargan
[ ] Excel se genera
[ ] PDF se genera
[ ] Tema claro/oscuro funciona
[ ] manifest.json carga
[ ] service-worker.js se registra
[ ] PWA puede instalarse en navegador compatible
[ ] No se está sirviendo una versión antigua desde caché
```

---

# 20. Problemas comunes

## La aplicación muestra una versión antigua

Posible causa:

```text
Service Worker / caché
```

Acciones recomendadas:

1. recargar la aplicación;
2. comprobar el Service Worker;
3. comprobar la versión de `CACHE_NAME`;
4. revisar que `index.html` y `service-worker.js` no estén siendo cacheados por el hosting.

---

## Firebase Authentication falla después del deployment

Comprobar:

```text
dominio autorizado
authDomain
configuración del proyecto Firebase
```

---

## Firestore devuelve `permission-denied`

Comprobar:

```text
firestore.rules
usuario autenticado
ruta consultada
reglas desplegadas actualmente
```

Modificar las validaciones JavaScript del frontend no sustituye las reglas de Firestore.

---

## La PWA no se actualiza

Comprobar:

```text
CACHE_NAME
service-worker.js
Cache-Control
DevTools → Application → Service Workers
```

---

## Una ruta carga 404

Vercel y Firebase Hosting están configurados para enviar rutas de aplicación a:

```text
/index.html
```

Si se modifica la configuración de hosting, debe conservarse el rewrite necesario para el comportamiento SPA.

---

# 21. Netlify y `_redirects`

El repositorio todavía contiene:

```text
_redirects
```

Este archivo corresponde a compatibilidad con Netlify.

Netlify **no es el hosting principal de KenFinance v1.0**.

Por tanto, la presencia de `_redirects` no significa que producción utilice Netlify.

Puede mantenerse mientras se quiera conservar esa opción alternativa.

---

# 22. Estado del despliegue v1.0

La arquitectura de producción documentada para KenFinance v1.0 es:

```text
GitHub
   │
   ▼
Vercel
   │
   ▼
KenFinance
HTML + CSS + JavaScript
   │
   ├── manifest.json
   ├── service-worker.js
   │
   ▼
Firebase
├── Authentication
└── Cloud Firestore
```

## Hosting principal

```text
Vercel
```

## Backend

```text
Firebase
```

## Proyecto Firebase configurado

```text
konteo-fiance
```

## Hosting alternativo configurado

```text
Firebase Hosting
```

## Compatibilidad adicional presente

```text
Netlify (_redirects)
```

---

# 📌 Alcance de esta documentación

Esta guía corresponde exclusivamente a:

**KenFinance v1.0 — Fase 1**

Documenta los archivos de despliegue existentes en esta versión y no incluye todavía cambios de arquitectura o despliegue correspondientes a versiones posteriores.
