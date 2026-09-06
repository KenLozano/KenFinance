# 💰 KenFinance

> **Gestión de finanzas personales simple, visual y organizada.**

![Estado](https://img.shields.io/badge/Estado-Estable-brightgreen)
![Versión](https://img.shields.io/badge/Versión-2.0.0-blue)
![Angular](https://img.shields.io/badge/Angular-20.3.29-red)
![Ionic](https://img.shields.io/badge/Ionic-9-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Firebase](https://img.shields.io/badge/Firebase-Authentication%20%2B%20Firestore-orange)
![PWA](https://img.shields.io/badge/PWA-Instalable-blueviolet)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-black)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green)

---

## 📌 Descripción

**KenFinance** es una aplicación web de finanzas personales orientada al registro, organización y análisis de ingresos, gastos y cuentas financieras.

La versión **2.0.0** representa el cierre de la **Fase 2** del proyecto y supone una modernización completa respecto a KenFinance v1.0.

La aplicación fue migrada desde una arquitectura basada en **HTML, CSS y JavaScript modular** hacia una arquitectura moderna basada en:

- Angular 20;
- Ionic 9;
- TypeScript;
- Firebase Authentication;
- Cloud Firestore.

La v2.0 incorpora una nueva estructura modular, navegación por páginas, experiencia responsive para escritorio y móvil, mejoras de UI/UX y una base técnica preparada para continuar evolucionando mediante nuevas versiones.

---

## ✨ Funcionalidades principales

### 🔐 Autenticación

KenFinance utiliza **Firebase Authentication** para gestionar el acceso a la aplicación.

La v2.0 incluye:

- inicio de sesión;
- cierre de sesión;
- persistencia de sesión;
- protección de rutas;
- redirección de usuarios no autenticados;
- gestión del estado de autenticación desde Angular.

---

### 👤 Perfil de usuario

KenFinance permite almacenar información asociada al perfil del usuario.

Los datos del perfil pueden utilizarse para personalizar distintos módulos de la aplicación y la generación de reportes.

---

### 💳 Portafolio y cuentas

El módulo **Portafolio** permite organizar las diferentes cuentas financieras del usuario.

Cada cuenta puede representar diferentes formas de almacenar dinero, como:

- cuentas bancarias;
- billeteras digitales;
- efectivo;
- otras cuentas financieras compatibles con el sistema.

Los movimientos financieros se encuentran asociados a una cuenta específica, permitiendo mantener la relación entre cuentas, saldos e historial.

---

### 💰 Saldo inicial

Al crear una cuenta se puede establecer un saldo inicial.

El sistema mantiene la relación entre el saldo y los movimientos asociados a la cuenta para evitar inconsistencias entre:

```text
Movimientos
↕
Saldo calculado
```

El saldo inicial no debe interpretarse como un ingreso generado durante el período analizado.

---

### 📥 Ingresos

KenFinance permite registrar ingresos asociados a una cuenta.

Cada ingreso:

- pertenece al usuario autenticado;
- está asociado a una cuenta;
- incrementa el saldo correspondiente;
- aparece en el historial;
- participa en los cálculos financieros correspondientes.

---

### 📤 Gastos

KenFinance permite registrar gastos asociados a una cuenta.

Cada gasto:

- pertenece al usuario autenticado;
- está asociado a una cuenta;
- reduce el saldo correspondiente;
- aparece en el historial;
- participa en los indicadores y análisis financieros.

---

### 🏦 Saldo por cuenta

Los movimientos registrados determinan el saldo correspondiente de cada cuenta.

Conceptualmente:

```text
Saldo
=
Saldo inicial
+
Ingresos
-
Gastos
```

La aplicación busca mantener consistencia entre:

```text
Cuenta
↕
Movimientos
↕
Historial
↕
Dashboard
```

---

## 🏠 Home

La página principal presenta un resumen financiero del usuario.

Incluye información relacionada con:

- balance del período;
- ingresos;
- gastos;
- patrimonio o saldo total;
- movimientos recientes;
- cuentas;
- indicadores financieros;
- gráficos;
- acceso rápido al registro de movimientos.

El contenido mostrado depende del período seleccionado.

---

## 📅 Filtros temporales

KenFinance permite analizar la información financiera mediante distintos períodos.

Entre los filtros disponibles se encuentran:

- día;
- semana;
- mes;
- rango personalizado.

---

## 📜 Historial

El módulo **Historial** se encuentra separado del Home en la v2.0.

Permite consultar los movimientos financieros registrados y analizar su información de manera independiente del dashboard principal.

---

## 📊 Indicadores y análisis

KenFinance utiliza la información financiera registrada para generar diferentes indicadores y resúmenes.

Estos datos permiten analizar elementos como:

- ingresos;
- gastos;
- balance;
- comportamiento financiero;
- distribución de gastos;
- evolución durante períodos determinados.

---

## 🎯 Plan financiero

El módulo de plan financiero permite almacenar parámetros y objetivos utilizados para comparar el comportamiento financiero del usuario.

Esta información se integra con otros módulos de KenFinance para ofrecer contexto sobre su desempeño financiero.

---

## 📄 Reportes

KenFinance permite generar reportes financieros en:

```text
Excel
PDF
```

Los reportes utilizan información proveniente de los movimientos, cuentas y perfil del usuario.

Pueden incluir:

- período analizado;
- fecha de generación;
- información del usuario;
- ingresos;
- gastos;
- balance;
- movimientos;
- información financiera adicional.

Los saldos iniciales se diferencian de los ingresos generados durante el período.

---

## 🎨 Interfaz

KenFinance v2.0 introduce un rediseño completo de la experiencia visual.

La interfaz está desarrollada con **Angular + Ionic** y contempla:

- diseño responsive;
- experiencia adaptada a escritorio;
- experiencia adaptada a móvil;
- navegación por páginas;
- navegación inferior en dispositivos móviles;
- modales;
- estados de carga;
- estados vacíos;
- tema visual propio de KenFinance;
- componentes reutilizables.

Desktop y móvil no necesariamente muestran exactamente la misma distribución, ya que cada interfaz busca aprovechar mejor el espacio disponible.

---

## 📱 PWA

KenFinance puede utilizarse como **Progressive Web App** en navegadores compatibles.

La aplicación utiliza soporte de Service Worker mediante Angular y puede instalarse en dispositivos compatibles.

KenFinance continúa dependiendo de servicios online como Firebase para las operaciones que requieren sincronización o persistencia remota.

La v2.0 no debe considerarse una aplicación completamente offline-first.

---

## 🛠️ Tecnologías

### Frontend

- Angular 20.3.29.
- Ionic 9.
- TypeScript 5.9.3.
- HTML.
- SCSS.
- RxJS 7.8.x.
- Ionicons 8.1.x.

### Backend / BaaS

- Firebase Authentication.
- Cloud Firestore.
- AngularFire 20.0.1.
- Firebase SDK.

### PWA

- Angular Service Worker 20.3.29.
- Progressive Web App.

### Capacidades híbridas

- Capacitor 8.
- Capacitor App.
- Capacitor Haptics.
- Capacitor Keyboard.
- Capacitor Status Bar.

### Exportación

- jsPDF 4.2.1.
- SheetJS / XLSX 0.20.3.

### Desarrollo y calidad

- Angular CLI 20.3.34.
- Ionic CLI.
- ESLint 9.16.
- Angular ESLint 20.
- Vitest 3.2.7.
- jsdom 26.
- npm.
- Node.js.

### Hosting

- **Vercel**.

---

## 🏗️ Arquitectura

KenFinance v2.0 utiliza una arquitectura modular basada en Angular.

La estructura general separa responsabilidades mediante módulos y funcionalidades.

```text
src/
└── app/
    │
    ├── core/
    │   └── auth/
    │
    ├── features/
    │   ├── auth/
    │   ├── home/
    │   ├── history/
    │   └── portfolio/
    │
    └── ...
```

### `core/`

Contiene lógica central y servicios compartidos por la aplicación.

Entre sus responsabilidades se encuentra la gestión de autenticación.

### `features/`

Agrupa funcionalidades de negocio y páginas principales.

Actualmente incluye módulos relacionados con:

- autenticación;
- Home;
- Historial;
- Portafolio.

> La estructura detallada se documenta en `GUIA_TECNICA_COMPLETA.md`.

---

## 🗃️ Persistencia de datos

KenFinance utiliza **Cloud Firestore** como sistema principal de persistencia.

Los datos financieros están asociados al usuario autenticado mediante Firebase Authentication.

El sistema gestiona información relacionada con:

- usuarios;
- perfil;
- cuentas;
- movimientos;
- plan financiero;
- información utilizada por reportes.

La autorización y aislamiento de los datos debe mantenerse mediante **Firestore Security Rules**.

---

## 🚀 Desarrollo local

### Requisitos

- Git.
- Node.js.
- npm.
- Ionic CLI.
- navegador moderno.

### Clonar el repositorio

```bash
git clone https://github.com/KenLozano/KenFinance.git
cd KenFinance
```

> Si el repositorio es privado, GitHub solicitará autenticación.

### Instalar dependencias

```bash
npm install
```

### Ejecutar en desarrollo

El script oficial definido en `package.json` es:

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

cuando Ionic CLI está instalado en el entorno.

---

## 🏭 Build de producción

Para generar una compilación de producción:

```bash
npm run build
```

El script ejecuta:

```text
ng build
```

La salida generada por el proyecto se encuentra en:

```text
www/
```

Durante el cierre de v2.0 el build fue validado correctamente.

Actualmente pueden aparecer warnings relacionados con:

- presupuestos de tamaño de algunos archivos SCSS;
- dependencias CommonJS utilizadas indirectamente por librerías de generación de reportes.

Estos warnings no impiden la generación del build ni representan por sí mismos fallos funcionales.

---

## 🧪 Scripts disponibles

```text
npm start
npm run build
npm run watch
npm test
npm run lint
```

Funciones:

- `start`: servidor de desarrollo Angular;
- `build`: compilación de producción;
- `watch`: compilación continua en configuración de desarrollo;
- `test`: ejecución de pruebas;
- `lint`: análisis estático del código.

---

## ☁️ Despliegue

KenFinance utiliza **Vercel** como plataforma principal de despliegue.

La rama estable del proyecto es:

```text
main
```

Los cambios destinados a nuevas versiones pueden desarrollarse previamente en ramas independientes antes de integrarse mediante Pull Request.

El deployment de producción se genera a partir del estado estable de `main`.

Para información detallada consulta:

**[DEPLOYMENT.md](DEPLOYMENT.md)**

---

## 🔥 Firebase

KenFinance utiliza Firebase para:

```text
Authentication
+
Cloud Firestore
```

La configuración debe corresponder al mismo proyecto utilizado por la aplicación en producción.

Las reglas de Firestore constituyen la principal capa de autorización para proteger los datos almacenados.

---

## 🔒 Seguridad

La arquitectura de KenFinance contempla:

- Firebase Authentication;
- protección de rutas Angular;
- Firestore Security Rules;
- aislamiento de información mediante usuario autenticado;
- validaciones del frontend;
- control de acceso a los módulos protegidos.

> Las validaciones realizadas en Angular no sustituyen las reglas de seguridad de Firestore.

Las reglas del backend deben impedir que un usuario pueda consultar o modificar información perteneciente a otro usuario.

---

## 🧪 Calidad y QA

Antes de publicar KenFinance v2.0 se realizaron pruebas sobre el entorno local, Preview y producción.

Entre los puntos comprobados se encuentran:

- build de producción;
- carga de la aplicación;
- autenticación;
- cierre de sesión;
- persistencia de sesión;
- rutas protegidas;
- Home;
- Historial;
- Portafolio;
- Perfil;
- Plan;
- Reportes;
- comportamiento responsive;
- despliegue mediante Vercel;
- comportamiento general en producción.

### Resultado

```text
GO con observación
```

No se identificaron problemas bloqueantes para la publicación de v2.0.

---

## ⚠️ Observaciones y limitaciones conocidas de v2.0

### UI / UX

En determinadas vistas existe actualmente un espacio vertical mayor al necesario después de finalizar el contenido.

Esto permite continuar desplazándose parcialmente aunque ya no exista información adicional.

```text
Severidad QA: P2
Impacto funcional: ninguno
Release: no bloqueante
```

Se prevé corregirlo en una versión de mantenimiento posterior.

### Build

Existen warnings no bloqueantes relacionados con:

- budgets SCSS;
- dependencias CommonJS utilizadas por determinadas librerías.

No impiden compilar ni ejecutar la aplicación.

### Funcionalidades todavía no implementadas

KenFinance v2.0 todavía no incluye:

- transferencias entre cuentas propias;
- sistema completo de notificaciones financieras;
- metas financieras avanzadas;
- inversiones;
- gestión completa de deudas;
- automatizaciones financieras avanzadas;
- sistema completo de recomendaciones.

Estas funcionalidades forman parte de futuras etapas del proyecto.

---

## 📚 Documentación

| Documento | Descripción |
|---|---|
| [README.md](README.md) | Introducción general y estado actual del proyecto |
| [GUIA_TECNICA_COMPLETA.md](GUIA_TECNICA_COMPLETA.md) | Arquitectura y funcionamiento técnico |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Configuración y proceso de despliegue |
| [CHANGELOG.md](CHANGELOG.md) | Historial de cambios y versiones |

La documentación será actualizada junto con cada versión estable del proyecto.

---

## 🗺️ Próximas versiones

Tras el cierre de la Fase 2, el desarrollo continuará mediante versiones incrementales.

Entre las mejoras previstas se encuentran:

- correcciones de UI/UX;
- mejoras del header en escritorio;
- accesos rápidos al perfil;
- sistema de notificaciones;
- evolución del módulo Portafolio;
- transferencias entre cuentas;
- categorías más avanzadas;
- metas financieras;
- calendario financiero;
- suscripciones;
- deudas;
- inversiones;
- multimoneda avanzada;
- análisis financiero avanzado;
- automatizaciones.

Estas funcionalidades se desarrollarán progresivamente y no representan compromisos de versión específicos.

---

## 🔄 Evolución del proyecto

### Fase 1 — KenFinance v1.0

Primera versión estable desarrollada con:

```text
HTML
CSS
JavaScript modular
Firebase
```

Permitió validar la lógica principal del sistema y establecer la base funcional de KenFinance.

### Fase 2 — KenFinance v2.0

Modernización completa del frontend mediante:

```text
Angular 20
Ionic 9
TypeScript
Firebase
```

Incluyó:

- nueva arquitectura;
- navegación modular;
- rediseño responsive;
- Home renovado;
- Historial independiente;
- Portafolio;
- mejoras de autenticación;
- mejoras de estructura y mantenibilidad;
- preparación del proyecto para futuras versiones.

Estado:

```text
FINALIZADA
```

---

## 📦 Versión

Versión estable actual:

```text
2.0.0
```

KenFinance v2.0 representa el cierre de la **Fase 2 — Rediseño y modernización**.

Consulta el historial completo en:

**[CHANGELOG.md](CHANGELOG.md)**

---

## 📄 Licencia

El proyecto declara licencia:

```text
MIT
```

---

## 👨‍💻 Autor

**Ken Lozano**

GitHub: [@KenLozano](https://github.com/KenLozano)

---

<div align="center">

### KenFinance

**Organiza hoy. Entiende mañana. Decide mejor.**

</div>
