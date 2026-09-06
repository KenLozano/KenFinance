# 🛠️ Guía Técnica — KenFinance v2.0

> Documentación técnica correspondiente al estado estable de **KenFinance v2.0 / Fase 2**.

**Versión:** 2.0.0  
**Frontend:** Angular 20.3.29 + Ionic 9 + TypeScript 5.9.3  
**Backend / BaaS:** Firebase Authentication + Cloud Firestore  
**PWA:** Angular Service Worker  
**Reportes:** jsPDF 4.2.1 + SheetJS/XLSX 0.20.3  
**Capacidades híbridas:** Capacitor 8  
**Hosting principal:** Vercel  
**Estado de release:** GO con observación no bloqueante  

---

# 📑 Índice

1. [Objetivo de esta guía](#1-objetivo-de-esta-guía)
2. [Descripción general](#2-descripción-general)
3. [Evolución desde v1.0](#3-evolución-desde-v10)
4. [Stack tecnológico](#4-stack-tecnológico)
5. [Arquitectura de v2.0](#5-arquitectura-de-v20)
6. [Organización del frontend](#6-organización-del-frontend)
7. [Flujo general de la aplicación](#7-flujo-general-de-la-aplicación)
8. [Routing y navegación](#8-routing-y-navegación)
9. [Autenticación](#9-autenticación)
10. [Protección de rutas](#10-protección-de-rutas)
11. [Firebase y persistencia](#11-firebase-y-persistencia)
12. [Modelo de datos y aislamiento por usuario](#12-modelo-de-datos-y-aislamiento-por-usuario)
13. [Perfil de usuario](#13-perfil-de-usuario)
14. [Portafolio y cuentas](#14-portafolio-y-cuentas)
15. [Saldo inicial](#15-saldo-inicial)
16. [Ingresos](#16-ingresos)
17. [Gastos](#17-gastos)
18. [Cálculo de saldos](#18-cálculo-de-saldos)
19. [Home y dashboard](#19-home-y-dashboard)
20. [Historial](#20-historial)
21. [Plan financiero](#21-plan-financiero)
22. [Reportes](#22-reportes)
23. [Interfaz responsive](#23-interfaz-responsive)
24. [PWA](#24-pwa)
25. [Capacitor](#25-capacitor)
26. [Seguridad](#26-seguridad)
27. [Testing y QA](#27-testing-y-qa)
28. [Desarrollo local](#28-desarrollo-local)
29. [Build de producción](#29-build-de-producción)
30. [Despliegue](#30-despliegue)
31. [Limitaciones conocidas](#31-limitaciones-conocidas)
32. [Estado técnico de v2.0](#32-estado-técnico-de-v20)
33. [Alcance de esta documentación](#33-alcance-de-esta-documentación)

---

# 1. Objetivo de esta guía

Esta guía documenta la arquitectura y el funcionamiento técnico de:

**KenFinance v2.0 / Fase 2**

Su objetivo es facilitar:

- comprensión de la arquitectura actual;
- mantenimiento del proyecto;
- incorporación de nuevas funcionalidades;
- localización de responsabilidades;
- revisión de seguridad;
- pruebas y control de calidad;
- despliegue y soporte;
- continuidad entre versiones.

La guía sustituye la documentación técnica de v1.0 como referencia principal del estado actual.

---

# 2. Descripción general

KenFinance es una aplicación de finanzas personales orientada al registro, organización y análisis de:

- ingresos;
- gastos;
- cuentas;
- saldos;
- movimientos;
- información de perfil;
- plan financiero;
- reportes.

La versión 2.0 representa una modernización completa del frontend respecto a v1.0.

La aplicación utiliza:

```text
Angular
+
Ionic
+
TypeScript
+
Firebase Authentication
+
Cloud Firestore
```

y se despliega principalmente mediante Vercel.

La v2.0 mantiene la lógica financiera central desarrollada en la Fase 1, pero reorganiza la aplicación mediante páginas, componentes, servicios y rutas propias de Angular.

---

# 3. Evolución desde v1.0

## v1.0

La Fase 1 utilizaba:

```text
HTML
CSS
JavaScript ES Modules
Firebase
```

La aplicación estaba organizada principalmente alrededor de:

```text
index.html
js/app.js
js/state.js
services/
ui/
```

## v2.0

La Fase 2 migra el frontend hacia:

```text
Angular 20
Ionic 9
TypeScript
```

La nueva arquitectura separa funcionalidades mediante:

```text
core/
features/
routing
services
components/pages
```

Esta migración mejora principalmente:

- separación de responsabilidades;
- mantenibilidad;
- tipado;
- escalabilidad;
- navegación;
- experiencia responsive;
- capacidad de crecimiento futuro.

---

# 4. Stack tecnológico

## Frontend

```text
Angular 20.3.29
Ionic 9
TypeScript 5.9.3
HTML
SCSS
RxJS 7.8.x
Ionicons 8.1.x
```

## Backend / BaaS

```text
Firebase Authentication
Cloud Firestore
AngularFire 20.0.1
Firebase SDK
```

Firebase continúa siendo el backend administrado principal.

## PWA

```text
@angular/service-worker 20.3.29
```

Angular proporciona el mecanismo principal de Service Worker utilizado por la versión 2.

## Capacidades híbridas

```text
Capacitor 8
@capacitor/app
@capacitor/haptics
@capacitor/keyboard
@capacitor/status-bar
```

Estas dependencias preparan el proyecto para integraciones híbridas y móviles.

## Reportes

```text
jsPDF 4.2.1
SheetJS / XLSX 0.20.3
```

## Desarrollo y calidad

```text
Angular CLI 20.3.34
Ionic CLI
ESLint 9.16
Angular ESLint 20
Vitest 3.2.7
jsdom 26
npm
Node.js
```

## Hosting

```text
Vercel
```

---

# 5. Arquitectura de v2.0

KenFinance v2.0 utiliza una arquitectura modular propia de Angular.

Vista conceptual:

```text
                    Navegador / PWA
                          │
                          ▼
                    Angular Router
                          │
             ┌────────────┼────────────┐
             │            │            │
             ▼            ▼            ▼
           Home       Historial    Portafolio
             │            │            │
             └────────────┼────────────┘
                          ▼
                    Servicios Angular
                          │
                 ┌────────┴────────┐
                 ▼                 ▼
          Firebase Auth       Cloud Firestore
```

Las responsabilidades se distribuyen en:

- `core/`: servicios y lógica transversal;
- `features/`: funcionalidades y páginas;
- router: navegación;
- Firebase/AngularFire: autenticación y datos;
- componentes Ionic/Angular: interfaz.

La v2.0 evita regresar al patrón de un único archivo JavaScript orquestando toda la aplicación.

---

# 6. Organización del frontend

La estructura confirmada del proyecto incluye al menos:

```text
src/
└── app/
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

## `core/`

Agrupa lógica transversal reutilizable.

Actualmente se utiliza para responsabilidades como autenticación.

## `features/`

Agrupa funcionalidades de negocio y páginas independientes.

Entre las áreas confirmadas se encuentran:

```text
auth
home
history
portfolio
```

La estructura completa puede crecer con nuevas funcionalidades manteniendo esta separación.

> Esta guía evita documentar rutas o archivos adicionales no verificados como si fueran parte confirmada de la estructura.

---

# 7. Flujo general de la aplicación

El flujo principal puede resumirse así:

```text
Usuario abre KenFinance
        │
        ▼
Angular inicializa la aplicación
        │
        ▼
Firebase comprueba la sesión
        │
     ┌──┴───┐
     │      │
     ▼      ▼
No auth   Autenticado
     │      │
     ▼      ▼
   Login   Home
             │
       ┌─────┼────────┐
       ▼     ▼        ▼
 Historial Perfil  Portafolio
       │              │
       └──────┬───────┘
              ▼
         Servicios
              │
              ▼
          Firestore
```

La sesión de Firebase determina el acceso a las rutas protegidas.

---

# 8. Routing y navegación

Angular Router gestiona la navegación de KenFinance v2.0.

Entre las rutas principales confirmadas se encuentran páginas relacionadas con:

- autenticación;
- Home;
- Historial;
- Portafolio.

La Fase 2 separó el Historial y Portafolio del Home, en lugar de concentrar toda la experiencia dentro de una única vista.

## Responsive

En móvil, la navegación utiliza una distribución optimizada para pantallas pequeñas.

En escritorio, KenFinance puede mostrar una composición diferente y aprovechar un área de trabajo mayor.

Desktop y móvil no están obligados a ser una copia 1:1 entre sí.

---

# 9. Autenticación

KenFinance utiliza Firebase Authentication.

La capa Angular de autenticación se encuentra centralizada mediante lógica dentro de `core/auth/`.

Entre los comportamientos validados para v2.0 se encuentran:

```text
inicio de sesión
cierre de sesión
persistencia de sesión
detección del usuario autenticado
redirección de usuarios no autenticados
```

Firebase mantiene la identidad del usuario y Angular reacciona al estado de sesión.

---

# 10. Protección de rutas

Las rutas internas que requieren autenticación deben estar protegidas.

Flujo esperado:

```text
Ruta protegida
      │
      ▼
¿Usuario autenticado?
   ┌──┴──┐
   Sí    No
   │      │
   ▼      ▼
Acceso   Login
```

Durante QA de v2.0 se comprobó que, después de cerrar sesión, el usuario no puede recuperar una sesión funcional simplemente utilizando la navegación "Atrás" del navegador.

La protección de rutas es una capa de experiencia y control de navegación.

> La autorización real sobre datos de Firestore no debe depender únicamente del router o de guards frontend.

---

# 11. Firebase y persistencia

KenFinance utiliza Firebase para dos responsabilidades principales:

```text
Firebase
├── Authentication
└── Cloud Firestore
```

## Authentication

Gestiona identidad y sesión.

## Firestore

Gestiona información persistente relacionada con:

- perfil;
- cuentas;
- movimientos;
- plan;
- datos utilizados por reportes.

AngularFire/Firebase SDK actúa como capa de acceso desde Angular.

---

# 12. Modelo de datos y aislamiento por usuario

Todos los datos financieros deben permanecer asociados al usuario autenticado.

Conceptualmente:

```text
Usuario autenticado
       │
       ▼
      uid
       │
       ├── Perfil
       ├── Cuentas
       ├── Movimientos
       └── Plan
```

El `uid` de Firebase Authentication es la referencia principal para separar la información entre usuarios.

## Regla de seguridad fundamental

Un usuario nunca debe poder:

```text
leer
crear
editar
eliminar
```

datos financieros pertenecientes a otro usuario.

La validación efectiva de esta condición corresponde a **Firestore Security Rules**.

> La estructura exacta de colecciones y subcolecciones de v2.0 debe documentarse a partir de los servicios Firestore y reglas vigentes. Esta guía no reutiliza automáticamente el esquema de v1.0 como si se hubiera verificado sin cambios.

---

# 13. Perfil de usuario

El módulo de perfil gestiona información asociada al usuario autenticado.

Esta información puede utilizarse para:

- personalización de la aplicación;
- configuración financiera;
- moneda base;
- reportes;
- datos propios del usuario.

La Fase 2 mantiene Perfil como una funcionalidad separada del dashboard principal.

---

# 14. Portafolio y cuentas

En v2.0, la gestión de cuentas se presenta mediante el concepto de:

```text
Portafolio
```

El Portafolio representa el conjunto de cuentas donde el usuario mantiene su dinero.

Ejemplos conceptuales:

```text
Cuenta bancaria
Billetera digital
Efectivo
otras cuentas financieras
```

Cada movimiento debe conservar la relación con una cuenta para mantener consistencia entre:

```text
Cuenta
↕
Movimiento
↕
Saldo
```

---

# 15. Saldo inicial

Una cuenta puede disponer de un saldo inicial.

Conceptualmente, el saldo inicial forma parte del estado financiero previo de la cuenta y no debe contabilizarse como ingreso generado durante el período.

Ejemplo:

```text
Nueva cuenta
Saldo inicial: S/ 500
```

Resultado esperado:

```text
Saldo de cuenta: S/ 500
Ingreso del día: S/ 0
```

Este principio mantiene continuidad con el modelo financiero definido en la Fase 1.

---

# 16. Ingresos

Los ingresos representan entradas reales de dinero.

Cada ingreso debe:

- pertenecer al usuario autenticado;
- asociarse a una cuenta;
- incrementar su saldo;
- reflejarse en el historial;
- participar en los cálculos del período.

---

# 17. Gastos

Los gastos representan salidas reales de dinero.

Cada gasto debe:

- pertenecer al usuario autenticado;
- asociarse a una cuenta;
- reducir su saldo;
- reflejarse en el historial;
- participar en los cálculos e indicadores correspondientes.

---

# 18. Cálculo de saldos

La relación financiera central de KenFinance continúa siendo:

```text
Saldo
=
Saldo inicial
+
Ingresos
-
Gastos
```

El objetivo es mantener consistencia entre:

```text
Movimientos
↕
Historial
↕
Cuenta
↕
Portafolio
↕
Home
```

Una edición o eliminación de movimientos debe reflejarse correctamente en el saldo resultante.

---

# 19. Home y dashboard

El Home actúa como resumen financiero principal.

Puede incluir información relacionada con:

- balance del período;
- ingresos;
- gastos;
- patrimonio / saldo total;
- movimientos recientes;
- cuentas;
- indicadores;
- gráficos;
- accesos rápidos.

El contenido se adapta al período seleccionado por el usuario.

---

# 20. Historial

La Fase 2 introduce Historial como una vista independiente.

Su función es permitir consultar y analizar movimientos sin depender de la presentación resumida del Home.

El Historial forma parte de la navegación principal de KenFinance v2.0.

---

# 21. Plan financiero

KenFinance mantiene un módulo relacionado con planificación financiera.

El plan puede utilizar valores configurados por el usuario para comparar:

```text
objetivos
vs.
comportamiento financiero real
```

Su información se integra con otros módulos como Home y reportes.

---

# 22. Reportes

KenFinance v2.0 mantiene generación de:

```text
Excel
PDF
```

## Excel

Se utiliza:

```text
SheetJS / XLSX 0.20.3
```

## PDF

Se utiliza:

```text
jsPDF 4.2.1
```

Los reportes pueden utilizar información procedente de:

- movimientos;
- ingresos;
- gastos;
- período;
- balance;
- perfil del usuario.

Los saldos iniciales deben diferenciarse de los ingresos reales del período.

---

# 23. Interfaz responsive

Ionic y Angular permiten construir una interfaz adaptable.

La v2.0 contempla:

```text
Desktop
Tablet
Móvil
```

## Móvil

La navegación prioriza:

- uso táctil;
- navegación inferior;
- formularios adaptados;
- componentes compactos.

## Desktop

La interfaz puede aprovechar:

- mayor ancho;
- distribución horizontal;
- contenido simultáneo;
- accesos visibles adicionales.

No se busca mantener una equivalencia visual 1:1 entre desktop y móvil.

---

# 24. PWA

KenFinance v2.0 incorpora soporte PWA mediante Angular.

La dependencia confirmada es:

```text
@angular/service-worker
```

Esto permite integrar capacidades como:

- instalación desde navegadores compatibles;
- Service Worker;
- recursos asociados a la experiencia PWA.

## Conectividad

KenFinance continúa dependiendo de Firebase para operaciones remotas.

Por ello, la v2.0 no debe describirse como una aplicación completamente offline-first.

---

# 25. Capacitor

El proyecto incorpora Capacitor 8 y plugins relacionados con:

```text
App
Haptics
Keyboard
Status Bar
```

Su presencia prepara KenFinance para capacidades híbridas y móviles.

Esto no significa que todas estas capacidades deban considerarse funcionalidad activa de v2.0 si todavía no están integradas en una build nativa publicada.

---

# 26. Seguridad

La seguridad de KenFinance se distribuye en varias capas.

## Firebase Authentication

Gestiona la identidad.

## Guards / routing

Impiden navegación no autorizada dentro del frontend.

## Firestore Security Rules

Constituyen la capa principal de autorización sobre los datos.

## Validaciones del frontend

Ayudan a prevenir entradas incorrectas y mejorar UX, pero no sustituyen las reglas del backend.

## Regla fundamental

```text
Frontend ≠ frontera de seguridad
```

Un usuario malicioso puede modificar el frontend o realizar solicitudes fuera de la interfaz.

Por ello:

```text
Authentication
+
Firestore Rules
```

deben proteger la información aunque el frontend sea manipulado.

## Secretos

No deben almacenarse en el repositorio:

```text
contraseñas
tokens privados
claves privadas
credenciales administrativas
```

La configuración pública del SDK web de Firebase no debe confundirse con una clave privada administrativa.

---

# 27. Testing y QA

Antes del cierre de v2.0 se realizaron pruebas funcionales manuales en:

```text
entorno local
Vercel Preview
producción
```

Entre los flujos revisados se encuentran:

- build;
- carga inicial;
- login;
- logout;
- persistencia de sesión;
- rutas protegidas;
- Home;
- Historial;
- Portafolio;
- Perfil;
- Plan;
- Reportes;
- responsive;
- producción.

## Resultado

```text
GO con observación
```

No se identificaron fallos P0 o P1 que bloquearan el release.

## Severidades utilizadas

```text
P0 = bloqueante
P1 = importante antes del release
P2 = corregible en versión de mantenimiento
P3 = mejora futura
```

---

# 28. Desarrollo local

## Requisitos

```text
Git
Node.js
npm
Ionic CLI
navegador moderno
```

## Instalar dependencias

```bash
npm install
```

## Iniciar desarrollo

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

cuando Ionic CLI está instalado.

## Tests

```bash
npm test
```

## Lint

```bash
npm run lint
```

## Watch

```bash
npm run watch
```

---

# 29. Build de producción

Para compilar:

```bash
npm run build
```

El script ejecuta:

```text
ng build
```

La salida del build utilizada actualmente por el proyecto es:

```text
www/
```

Durante el cierre de v2.0 el build terminó correctamente.

## Warnings conocidos

Pueden aparecer warnings relacionados con:

- budgets de algunos archivos SCSS;
- dependencias CommonJS indirectas utilizadas por librerías de reportes.

Estos warnings no impiden el build.

---

# 30. Despliegue

KenFinance utiliza:

```text
Vercel
```

como hosting principal.

La rama estable es:

```text
main
```

Flujo de release utilizado:

```text
rama de desarrollo
        │
        ▼
Pull Request
        │
        ▼
QA / Preview
        │
        ▼
Merge a main
        │
        ▼
Vercel Production
```

La configuración detallada de despliegue debe mantenerse en:

```text
DEPLOYMENT.md
```

---

# 31. Limitaciones conocidas

## Transferencias entre cuentas

v2.0 no incorpora todavía un movimiento específico para transferencias entre cuentas propias.

Esta funcionalidad queda para una versión futura.

## UI / UX

Existe una observación no bloqueante:

```text
espacio vertical excesivo después del contenido
```

en determinadas vistas.

Clasificación:

```text
P2
```

No afecta:

- datos;
- seguridad;
- cálculos;
- navegación principal.

Puede corregirse en una versión de mantenimiento.

## Build

Existen warnings no bloqueantes relacionados con SCSS y determinadas dependencias CommonJS.

## Offline

La aplicación no se considera completamente offline-first.

## Funcionalidades futuras

No forman parte del alcance confirmado de v2.0:

- transferencias internas;
- notificaciones financieras completas;
- metas avanzadas;
- inversiones;
- deudas completas;
- automatizaciones avanzadas;
- recomendaciones financieras completas.

---

# 32. Estado técnico de v2.0

KenFinance v2.0 cierra la Fase 2 con esta base tecnológica:

```text
KenFinance v2.0
│
├── Angular 20
│
├── Ionic 9
│
├── TypeScript 5.9
│
├── SCSS
│
├── RxJS
│
├── Angular Router
│
├── Firebase
│   ├── Authentication
│   └── Cloud Firestore
│
├── AngularFire
│
├── Reportes
│   ├── SheetJS
│   └── jsPDF
│
├── PWA
│   └── Angular Service Worker
│
├── Capacitor 8
│
├── QA
│   ├── Vitest
│   ├── ESLint
│   └── pruebas funcionales manuales
│
└── Hosting
    └── Vercel
```

## Estado del release

```text
Versión: 2.0.0
Fase: 2
Estado: ESTABLE
QA: GO CON OBSERVACIÓN
Producción: Vercel / main
```

---

# 33. Alcance de esta documentación

Esta guía corresponde a:

**KenFinance v2.0 — Fase 2**

Documenta la migración y arquitectura confirmada de Angular + Ionic + TypeScript y sustituye la Guía Técnica de v1.0 como referencia del estado actual.

No se han reutilizado como hechos de v2.0 aquellas rutas internas, colecciones Firestore o responsabilidades específicas de v1.0 que todavía no hayan sido verificadas en el código actual.

Para mantener esta guía alineada con futuras versiones:

1. actualizarla cuando cambie la arquitectura;
2. registrar cambios funcionales en `CHANGELOG.md`;
3. mantener `README.md` como resumen de alto nivel;
4. documentar despliegue en `DEPLOYMENT.md`;
5. documentar cambios de modelo de datos cuando se modifique Firestore.

---

<div align="center">

## KenFinance v2.0

**Fase 2 finalizada — arquitectura modernizada y preparada para evolución incremental.**

</div>
