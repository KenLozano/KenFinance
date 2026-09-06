# 🚀 Deployment — KenFinance v2.0

> Guía de despliegue correspondiente al estado estable de **KenFinance v2.0 / Fase 2**.

**Versión:** 2.0.0  
**Frontend:** Angular 20.3.29 + Ionic 9 + TypeScript 5.9.3  
**Backend / BaaS:** Firebase Authentication + Cloud Firestore  
**PWA:** Angular Service Worker  
**Hosting principal:** Vercel  
**Rama de producción:** `main`  
**Estado de release:** GO con observación no bloqueante  

---

# 📑 Índice

1. [Objetivo](#1-objetivo)
2. [Arquitectura de despliegue](#2-arquitectura-de-despliegue)
3. [Flujo de release](#3-flujo-de-release)
4. [Requisitos previos](#4-requisitos-previos)
5. [Preparación local](#5-preparación-local)
6. [Build de producción](#6-build-de-producción)
7. [Despliegue principal en Vercel](#7-despliegue-principal-en-vercel)
8. [Producción y rama `main`](#8-producción-y-rama-main)
9. [Preview Deployments](#9-preview-deployments)
10. [Routing SPA](#10-routing-spa)
11. [Firebase utilizado por producción](#11-firebase-utilizado-por-producción)
12. [Firebase Authentication](#12-firebase-authentication)
13. [Cloud Firestore](#13-cloud-firestore)
14. [Firestore Rules e índices](#14-firestore-rules-e-índices)
15. [PWA en producción](#15-pwa-en-producción)
16. [Service Worker y actualización](#16-service-worker-y-actualización)
17. [Manifest e instalación](#17-manifest-e-instalación)
18. [Seguridad de despliegue](#18-seguridad-de-despliegue)
19. [Actualización de producción](#19-actualización-de-producción)
20. [Rollback](#20-rollback)
21. [Checklist posterior al despliegue](#21-checklist-posterior-al-despliegue)
22. [Problemas comunes](#22-problemas-comunes)
23. [Warnings conocidos](#23-warnings-conocidos)
24. [Estado del despliegue v2.0](#24-estado-del-despliegue-v20)
25. [Alcance de esta documentación](#25-alcance-de-esta-documentación)

---

# 1. Objetivo

Este documento describe el proceso de despliegue de **KenFinance v2.0** y sustituye la guía correspondiente a v1.0 como referencia principal.

La arquitectura de producción actual puede resumirse así:

```text
Desarrollo local
      │
      ▼
Rama de desarrollo
      │
      ▼
Pull Request
      │
      ▼
Vercel Preview
      │
      ▼
QA / validación
      │
      ▼
Merge a main
      │
      ▼
Vercel Production
      │
      ▼
KenFinance v2.0
      │
      ├── Firebase Authentication
      └── Cloud Firestore
```

---

# 2. Arquitectura de despliegue

KenFinance v2.0 es una aplicación Angular/Ionic.

A diferencia de v1.0, el frontend requiere un proceso de compilación antes de ser publicado.

```text
Repositorio GitHub
       │
       ▼
   npm run build
       │
       ▼
      www/
       │
       ▼
     Vercel
       │
       ▼
KenFinance Web / PWA
       │
       ▼
Firebase
├── Authentication
└── Cloud Firestore
```

Node.js se utiliza como entorno de desarrollo y build.

KenFinance no dispone de un servidor Node.js propio como backend de producción.

---

# 3. Flujo de release

El flujo utilizado para cerrar v2.0 fue:

```text
v2-development
      │
      ▼
Pull Request hacia main
      │
      ▼
Preview Deployment
      │
      ▼
Validación QA
      │
      ▼
Resolución de conflictos
      │
      ▼
Merge a main
      │
      ▼
Production Deployment
```

Este flujo se recomienda para futuras versiones.

## Principio

`main` representa la versión estable.

Las nuevas versiones o cambios importantes deben desarrollarse preferentemente en ramas separadas y revisarse antes de integrarse a producción.

---

# 4. Requisitos previos

Para trabajar con KenFinance v2.0 se requiere:

```text
Git
Node.js
npm
Ionic CLI
navegador moderno
```

Para desplegar también se requiere acceso autorizado a:

```text
Repositorio GitHub
Proyecto Vercel
Proyecto Firebase
```

Las versiones principales utilizadas por v2.0 incluyen:

```text
Angular 20.3.29
Angular CLI 20.3.34
Ionic 9
TypeScript 5.9.3
```

---

# 5. Preparación local

Antes de publicar cambios debe comprobarse el estado del repositorio.

## Instalar dependencias

```bash
npm install
```

## Ejecutar desarrollo

Script oficial:

```bash
npm start
```

que ejecuta:

```text
ng serve
```

También puede utilizarse:

```bash
ionic serve
```

si Ionic CLI está instalado.

## Estado de Git

Antes de preparar un release:

```bash
git status
```

Debe revisarse que no existan cambios accidentales o archivos sin seguimiento que no deban formar parte del release.

---

# 6. Build de producción

El build oficial se ejecuta mediante:

```bash
npm run build
```

Este script ejecuta:

```text
ng build
```

Durante el cierre de v2.0, la salida generada por el proyecto fue:

```text
www/
```

Ejemplo de resultado esperado:

```text
Application bundle generation complete.
Output location: .../www
```

## Condición de aprobación

El build debe:

```text
✅ finalizar correctamente
❌ no contener errores bloqueantes
```

Pueden existir warnings conocidos documentados en esta guía.

---

# 7. Despliegue principal en Vercel

Vercel es el hosting principal de KenFinance v2.0.

El repositorio se encuentra conectado a Vercel, por lo que los cambios enviados a GitHub pueden generar deployments automáticamente.

Flujo general:

```text
Commit
  │
  ▼
Push
  │
  ▼
GitHub
  │
  ▼
Vercel detecta el cambio
  │
  ▼
Build
  │
  ▼
Deployment
```

---

# 8. Producción y rama `main`

La rama utilizada para producción es:

```text
main
```

Cuando un Pull Request es fusionado hacia `main`, Vercel genera el deployment de producción correspondiente.

Durante el cierre de v2.0 se utilizó este proceso:

```text
v2-development
      │
      ▼
Pull Request
      │
      ▼
Merge
      │
      ▼
main
      │
      ▼
Vercel Production
```

## Validación

Después del merge debe comprobarse en Vercel que el deployment:

```text
Environment: Production
Branch: main
Status: Ready
```

y que corresponde al commit esperado.

---

# 9. Preview Deployments

Vercel genera Preview Deployments para ramas o Pull Requests.

Estos entornos permiten:

- probar cambios antes de producción;
- ejecutar QA;
- revisar responsive;
- validar rutas;
- comprobar Firebase;
- detectar errores de consola.

## Importante

Preview y Production no deben considerarse entornos idénticos en todos los aspectos.

Durante QA de v2.0 se observaron errores relacionados con CORS/manifest en un entorno Preview que no afectaban el funcionamiento general de la aplicación.

Por ello, los problemas exclusivos de Preview deben confirmarse nuevamente en Production antes de clasificarlos como fallos definitivos del producto.

---

# 10. Routing SPA

KenFinance utiliza Angular Router.

Las rutas internas deben continuar funcionando cuando el usuario:

```text
abre una URL directa
actualiza con F5
recarga una ruta interna
```

Durante la validación de producción de v2.0 se comprobó el comportamiento de rutas internas.

## Configuración

v2.0 no mantiene el `vercel.json` heredado de v1.0.

La versión de producción fue validada sin reutilizar automáticamente aquella configuración antigua.

Si en una versión futura aparece un problema de 404 al refrescar rutas, debe revisarse primero la configuración efectiva del proyecto en Vercel antes de volver a introducir rewrites personalizados.

---

# 11. Firebase utilizado por producción

KenFinance utiliza Firebase para:

```text
Authentication
Cloud Firestore
```

La configuración utilizada por el frontend debe corresponder al mismo proyecto Firebase donde existen:

- usuarios;
- reglas de Firestore;
- datos;
- índices necesarios.

## Importante

El identificador exacto del proyecto Firebase debe verificarse directamente en la configuración vigente de v2.0 antes de documentarlo como dato permanente.

No debe asumirse automáticamente que cualquier identificador histórico de v1.0 continúa siendo el mismo sin comprobar el código actual.

---

# 12. Firebase Authentication

Firebase Authentication gestiona:

```text
sesión de usuario
inicio de sesión
cierre de sesión
persistencia de sesión
```

Después de publicar un dominio nuevo debe comprobarse que esté autorizado en Firebase Authentication cuando el método de autenticación utilizado lo requiera.

## Verificación mínima

```text
[ ] Login funciona
[ ] Logout funciona
[ ] Sesión persiste correctamente
[ ] Usuario no autenticado no accede a rutas protegidas
```

---

# 13. Cloud Firestore

Cloud Firestore almacena la información persistente de KenFinance.

Entre los datos manejados por v2.0 se encuentran:

```text
perfil
cuentas
movimientos
plan financiero
información utilizada por reportes
```

El acceso debe permanecer asociado al usuario autenticado.

---

# 14. Firestore Rules e índices

Firestore Security Rules representan la capa principal de autorización de datos.

Las validaciones del frontend no sustituyen estas reglas.

Si el repositorio mantiene archivos como:

```text
firestore.rules
firestore.indexes.json
firebase.json
```

los cambios de reglas o índices deben desplegarse de forma explícita mediante Firebase CLI.

Ejemplos:

```bash
firebase deploy --only firestore:rules
```

```bash
firebase deploy --only firestore:indexes
```

o:

```bash
firebase deploy --only firestore
```

## Regla de release

No debe modificarse una regla de producción sin:

1. revisar su alcance;
2. comprobar acceso autorizado;
3. comprobar aislamiento entre usuarios;
4. validar que no abra permisos innecesarios.

---

# 15. PWA en producción

KenFinance v2.0 incorpora PWA mediante:

```text
@angular/service-worker
```

La instalación requiere un entorno compatible y HTTPS.

Vercel proporciona HTTPS en producción.

## Validación

Debe comprobarse:

```text
[ ] manifest disponible
[ ] Service Worker registrado
[ ] aplicación instalable
[ ] iconos correctos
[ ] nombre correcto
[ ] apertura independiente del navegador cuando corresponde
```

---

# 16. Service Worker y actualización

Angular gestiona el Service Worker de la PWA.

No debe asumirse que v2.0 utiliza el archivo manual:

```text
service-worker.js
```

de la arquitectura v1.0.

## Riesgo de caché

Una PWA puede conservar recursos de una versión anterior.

Si después de un deployment el usuario continúa viendo una versión vieja, deben revisarse:

```text
DevTools
→ Application
→ Service Workers

DevTools
→ Application
→ Cache Storage
```

y comprobar si el deployment nuevo ya se encuentra activo.

---

# 17. Manifest e instalación

La identidad de la PWA debe definirse mediante la configuración vigente del proyecto Angular.

La instalación puede ofrecerse desde navegadores compatibles.

## Desktop

En Chrome u otros navegadores compatibles puede aparecer:

```text
Instalar aplicación
```

## Android

Puede aparecer como:

```text
Instalar aplicación
Agregar a pantalla principal
```

El texto exacto depende del navegador.

---

# 18. Seguridad de despliegue

No deben publicarse en el repositorio:

```text
contraseñas
tokens privados
claves privadas
credenciales administrativas
archivos de cuenta de servicio
```

La configuración pública del SDK web de Firebase no debe confundirse con una credencial administrativa.

## Producción

Antes de publicar debe comprobarse:

- autenticación;
- reglas de Firestore;
- rutas protegidas;
- ausencia de secretos;
- errores de consola;
- comportamiento de Firebase;
- aislamiento entre usuarios.

---

# 19. Actualización de producción

Flujo recomendado para una versión:

```bash
git checkout <rama-desarrollo>
git status
npm run build
```

Después:

```text
commit
push
Pull Request
QA Preview
merge a main
```

Vercel desplegará el nuevo estado de `main`.

## Cambios pequeños de documentación

Los cambios puramente documentales pueden gestionarse de forma separada, pero deben mantenerse sincronizados entre Git local y remoto.

---

# 20. Rollback

Si una publicación introduce un problema importante existen dos mecanismos principales.

## Opción A — Vercel

Vercel conserva deployments anteriores.

Puede promoverse o restaurarse un deployment estable previo desde el panel correspondiente.

## Opción B — Git

Puede revertirse el commit:

```bash
git revert <commit>
git push origin main
```

## Regla

Evitar:

```bash
git push --force
```

sobre `main` salvo un caso excepcional y completamente controlado.

Para operación normal de KenFinance se recomienda `git revert`.

---

# 21. Checklist posterior al despliegue

Después de cada release de producción comprobar:

```text
[ ] Production Deployment está en Ready
[ ] Branch = main
[ ] La aplicación abre mediante HTTPS
[ ] Login funciona
[ ] Logout funciona
[ ] La sesión se mantiene correctamente
[ ] Rutas protegidas funcionan
[ ] F5 en rutas internas no rompe la aplicación
[ ] Home carga
[ ] Historial carga
[ ] Portafolio carga
[ ] Perfil carga
[ ] Plan carga
[ ] Reportes cargan
[ ] Crear datos financieros funciona
[ ] Modificar datos financieros funciona
[ ] Eliminar datos financieros funciona
[ ] Saldos permanecen consistentes
[ ] Firestore puede leer datos autorizados
[ ] Firestore puede escribir datos autorizados
[ ] No aparecen errores críticos en consola
[ ] Diseño móvil funciona
[ ] Diseño desktop funciona
[ ] Manifest carga
[ ] Service Worker funciona
[ ] PWA puede instalarse
```

---

# 22. Problemas comunes

## Vercel muestra una versión anterior

Comprobar:

```text
Deployment activo
Commit desplegado
Branch
caché
Service Worker
```

Después puede probarse:

```text
Ctrl + F5
```

o una ventana de incógnito.

---

## Push rechazado con `non-fast-forward`

Esto significa que la rama remota contiene cambios que la rama local todavía no integra.

No debe resolverse automáticamente con `--force`.

Primero:

```bash
git status
git pull
```

y revisar el historial antes de continuar.

---

## No se puede cambiar de rama

Si Git muestra:

```text
local changes would be overwritten by checkout
```

existen cambios locales sin guardar.

Opciones seguras:

```text
commit
```

o:

```bash
git stash
```

antes de cambiar de rama.

---

## Firestore devuelve `permission-denied`

Comprobar:

```text
usuario autenticado
ruta consultada
Firestore Rules
reglas realmente desplegadas
uid utilizado
```

No debe "solucionarse" abriendo permisos generales.

---

## Login falla únicamente en producción

Comprobar:

```text
dominio autorizado
configuración Firebase
estado del deployment
errores de consola
```

---

## PWA no aparece como instalable

Comprobar:

```text
HTTPS
manifest
Service Worker
DevTools → Application
errores de consola
```

También debe comprobarse que el problema no sea exclusivo de un Preview Deployment.

---

## Una ruta falla al recargar

Comprobar:

```text
Angular Router
configuración Vercel
ruta generada
deployment actual
```

No agregar un rewrite personalizado sin comprobar primero la causa.

---

# 23. Warnings conocidos

El build de v2.0 puede finalizar correctamente mostrando warnings.

## SCSS budgets

Se observaron archivos SCSS que superan ligeramente el budget configurado.

Ejemplos durante QA:

```text
history.component.scss
home.page.scss
login.component.scss
portfolio.component.scss
```

Impacto actual:

```text
No bloqueante
```

## CommonJS

También pueden aparecer warnings relacionados con dependencias utilizadas indirectamente por librerías como jsPDF/canvg.

El mensaje general indica posibles:

```text
optimization bailouts
```

No representa por sí mismo un error funcional ni una vulnerabilidad confirmada.

---

# 24. Estado del despliegue v2.0

La arquitectura de producción documentada es:

```text
GitHub
  │
  ▼
main
  │
  ▼
Vercel
  │
  ▼
Angular / Ionic
  │
  ├── PWA
  │
  ▼
Firebase
├── Authentication
└── Cloud Firestore
```

## Estado

```text
Versión: 2.0.0
Fase: 2
Hosting: Vercel
Rama producción: main
QA: GO con observación
Estado: ESTABLE
```

## Observación QA conocida

Existe una observación P2 de UI/UX:

```text
espacio vertical excesivo
después de finalizar el contenido
en determinadas vistas
```

No bloquea producción.

---

# 25. Alcance de esta documentación

Esta guía corresponde a:

**KenFinance v2.0 — Fase 2**

Sustituye el documento de deployment de v1.0 como referencia principal.

No conserva como hechos de v2.0 configuraciones históricas que no hayan sido verificadas, entre ellas:

- `vercel.json` de v1.0;
- Service Worker manual de v1.0;
- estructura Vanilla JS;
- configuración alternativa de hosting no confirmada para v2.0;
- identificadores Firebase históricos sin comprobar.

Para futuras versiones debe actualizarse este archivo cuando cambie:

- plataforma de hosting;
- rama de producción;
- proceso de build;
- configuración PWA;
- Firebase;
- reglas;
- estrategia de release;
- arquitectura de despliegue.

---

<div align="center">

## KenFinance v2.0

**Producción estable mediante GitHub + Vercel + Firebase.**

</div>
