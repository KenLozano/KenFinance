# 🛠️ Guía Técnica — KenFinance v1.0

> Documentación técnica correspondiente al estado final de **KenFinance v1.0 / Fase 1**.

**Versión:** 1.0.0  
**Frontend:** HTML5 + CSS3 + JavaScript ES Modules  
**Backend:** Firebase Authentication + Cloud Firestore  
**Visualización:** Chart.js  
**Reportes:** SheetJS + jsPDF  
**Tipo de aplicación:** Web App / PWA  
**Hosting principal:** Vercel  

---

# 📑 Índice

1. [Objetivo de esta guía](#1-objetivo-de-esta-guía)
2. [Descripción general](#2-descripción-general)
3. [Stack tecnológico](#3-stack-tecnológico)
4. [Arquitectura de v1.0](#4-arquitectura-de-v10)
5. [Estructura actual del proyecto](#5-estructura-actual-del-proyecto)
6. [Responsabilidad de los archivos](#6-responsabilidad-de-los-archivos)
7. [Flujo general de la aplicación](#7-flujo-general-de-la-aplicación)
8. [Estado de la aplicación](#8-estado-de-la-aplicación)
9. [Firebase](#9-firebase)
10. [Autenticación](#10-autenticación)
11. [Perfil de usuario](#11-perfil-de-usuario)
12. [Modelo de datos](#12-modelo-de-datos)
13. [Cuentas y activos](#13-cuentas-y-activos)
14. [Saldo inicial](#14-saldo-inicial)
15. [Ingresos](#15-ingresos)
16. [Gastos](#16-gastos)
17. [Cálculo de saldos de cuentas](#17-cálculo-de-saldos-de-cuentas)
18. [Saldo total de cuentas](#18-saldo-total-de-cuentas)
19. [Dashboard y balance del período](#19-dashboard-y-balance-del-período)
20. [Filtros temporales](#20-filtros-temporales)
21. [Búsqueda y filtros](#21-búsqueda-y-filtros)
22. [Ordenamiento](#22-ordenamiento)
23. [Gráficos](#23-gráficos)
24. [Insights financieros](#24-insights-financieros)
25. [Plan financiero](#25-plan-financiero)
26. [Reportes Excel](#26-reportes-excel)
27. [Reportes PDF](#27-reportes-pdf)
28. [Tema claro y oscuro](#28-tema-claro-y-oscuro)
29. [Modales, toasts y renderizado](#29-modales-toasts-y-renderizado)
30. [PWA](#30-pwa)
31. [Conectividad](#31-conectividad)
32. [Seguridad y validaciones](#32-seguridad-y-validaciones)
33. [Desarrollo local](#33-desarrollo-local)
34. [Lint](#34-lint)
35. [Limitaciones de v1.0](#35-limitaciones-de-v10)
36. [Estado técnico de v1.0](#36-estado-técnico-de-v10)

---

# 1. Objetivo de esta guía

Esta guía documenta exclusivamente la arquitectura y funcionalidades implementadas en:

**KenFinance v1.0 / Fase 1**

Su objetivo es permitir:

- comprender cómo está organizado el proyecto;
- identificar la responsabilidad de cada archivo;
- comprender el flujo de datos;
- conocer el modelo utilizado en Firestore;
- facilitar mantenimiento y corrección de errores;
- servir como referencia técnica de la versión 1.0.

Esta documentación **no describe versiones anteriores del proyecto ni cambios de arquitectura todavía no implementados**.

---

# 2. Descripción general

KenFinance v1.0 es una aplicación web de finanzas personales enfocada en registrar y analizar ingresos y gastos asociados a cuentas reales del usuario.

La aplicación permite:

- crear una cuenta de usuario;
- iniciar sesión;
- iniciar sesión con Google;
- recuperar contraseña;
- gestionar un perfil;
- crear cuentas financieras;
- registrar saldo inicial;
- registrar ingresos;
- registrar gastos;
- asociar movimientos a una cuenta;
- editar movimientos;
- eliminar movimientos;
- calcular automáticamente el saldo de las cuentas;
- consultar saldo total por moneda;
- filtrar movimientos por período;
- buscar movimientos;
- ordenar movimientos;
- visualizar gráficos;
- consultar indicadores financieros;
- configurar un plan financiero;
- exportar reportes Excel;
- exportar reportes PDF;
- instalar la aplicación como PWA;
- utilizar tema claro u oscuro.

La aplicación utiliza **Firebase** como servicio de autenticación y almacenamiento remoto.

---

# 3. Stack tecnológico

## Frontend

```text
HTML5
CSS3
JavaScript
ES Modules
```

KenFinance v1.0 no utiliza un framework frontend.

El código JavaScript está dividido en módulos para separar responsabilidades.

## Backend y persistencia

```text
Firebase Authentication
Cloud Firestore
```

Firebase Authentication administra la identidad de los usuarios.

Cloud Firestore almacena los datos financieros y de perfil.

## Gráficos

```text
Chart.js
```

Se utiliza para visualizar información financiera dentro del dashboard.

## Reportes

```text
SheetJS
jsPDF
```

SheetJS genera archivos Excel.

jsPDF genera documentos PDF.

## PWA

```text
manifest.json
service-worker.js
icons/
```

Estos archivos permiten que KenFinance tenga capacidades de Progressive Web App.

## Desarrollo

```text
Node.js
npm
ESLint
serve
```

Node.js no actúa como backend de KenFinance.

Se utiliza principalmente para herramientas de desarrollo.

---

# 4. Arquitectura de v1.0

KenFinance utiliza una arquitectura JavaScript modular.

```text
                    index.html
                        │
                        ▼
                    js/app.js
                        │
       ┌────────────────┼────────────────┐
       │                │                │
       ▼                ▼                ▼
   state.js         services/           ui/
                       │                 │
                 ┌─────┼─────┐      ┌───┼─────────────┐
                 │     │     │      │   │   │   │   │
                Auth   DB  Export Charts Render etc.
                 │     │
                 └──┬──┘
                    ▼
                 Firebase
              ┌─────┴─────┐
              │           │
             Auth      Firestore
```

`app.js` funciona como **orquestador principal**.

No concentra todas las responsabilidades internamente, sino que utiliza módulos especializados.

---

# 5. Estructura actual del proyecto

```text
KenFinance/
│
├── .firebaserc
├── .gitignore
├── .tmp-dev-server.cjs
├── DEPLOYMENT.md
├── eslint.config.cjs
├── estructura.txt
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── GUIA_TECNICA_COMPLETA.md
├── index.html
├── manifest.json
├── package-lock.json
├── package.json
├── privacy.html
├── README.md
├── service-worker.js
├── terms.html
├── vercel.json
├── _redirects
│
├── css/
│   └── styles.css
│
├── icons/
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
│
└── js/
    ├── app.js
    ├── state.js
    │
    ├── firebase/
    │   ├── config.js
    │   └── runtime-config.js
    │
    ├── services/
    │   ├── authService.js
    │   ├── dbService.js
    │   └── exportService.js
    │
    └── ui/
        ├── charts.js
        ├── helpers.js
        ├── insights.js
        ├── modals.js
        ├── render.js
        └── toast.js
```

Esta es la estructura correspondiente al cierre de la Fase 1.

---

# 6. Responsabilidad de los archivos

## `index.html`

Es la estructura principal de la aplicación.

Contiene, entre otros:

- pantalla de login;
- pantalla de registro;
- dashboard;
- formularios;
- filtros;
- tarjetas de información;
- sección de cuentas;
- gráficos;
- formularios de ingreso y gasto;
- perfil;
- modales;
- elementos necesarios para PWA.

También carga los recursos necesarios para la aplicación y utiliza `js/app.js` como punto de entrada JavaScript.

## `css/styles.css`

Contiene los estilos de toda la aplicación v1.0.

Se encarga de:

- layout;
- tarjetas;
- formularios;
- botones;
- dashboard;
- cuentas;
- movimientos;
- gráficos;
- modales;
- responsive;
- tema claro;
- tema oscuro;
- estados visuales.

## `js/app.js`

Es el principal coordinador de la aplicación.

Entre sus responsabilidades se encuentran:

- inicializar el tema;
- controlar conectividad;
- cargar el perfil;
- cargar cuentas;
- calcular saldos;
- cargar movimientos;
- aplicar filtros;
- actualizar dashboard;
- escuchar el estado de autenticación;
- gestionar formularios;
- editar movimientos;
- eliminar movimientos;
- guardar cuentas;
- guardar ingresos;
- guardar gastos;
- ejecutar exportaciones;
- registrar el Service Worker.

`app.js` consume los demás módulos en lugar de implementar toda su lógica internamente.

## `js/state.js`

Contiene el estado compartido de la aplicación.

Gestiona información como:

```text
usuario actual
filtro temporal
token de carga
estado de conectividad
ordenamiento
período de exportación
rango personalizado
configuración del plan
perfil del usuario
```

Algunas preferencias se persisten mediante `localStorage`.

## `js/firebase/config.js`

Centraliza el acceso a Firebase.

Expone las instancias utilizadas por el resto de la aplicación, principalmente:

```text
Firebase
Authentication
Firestore
```

## `js/firebase/runtime-config.js`

Contiene la configuración utilizada para inicializar Firebase en tiempo de ejecución.

Se carga antes del módulo principal de KenFinance.

### Servicios

## `js/services/authService.js`

Es la capa de abstracción para Firebase Authentication.

Expone operaciones como:

```text
onAuthStateChanged()
login()
register()
logout()
sendPasswordReset()
updateDisplayName()
loginWithGoogle()
```

De esta forma `app.js` no necesita implementar directamente cada llamada de Firebase Authentication.

## `js/services/dbService.js`

Centraliza la comunicación con Cloud Firestore.

Gestiona principalmente:

- perfiles;
- plan financiero;
- ingresos;
- gastos;
- lectura de transacciones;
- eliminación de movimientos;
- cuentas/assets;
- archivado de cuentas;
- cálculo de saldo por cuenta.

El objetivo es evitar consultas directas a Firestore repartidas innecesariamente por toda la interfaz.

## `js/services/exportService.js`

Contiene la lógica de generación de:

```text
Excel
PDF
```

También se encarga de cargar las bibliotecas necesarias para exportación cuando son requeridas.

### Interfaz

## `js/ui/helpers.js`

Agrupa funciones auxiliares reutilizables.

Entre ellas:

- formato de cantidades;
- normalización de texto;
- normalización de notas;
- normalización de etiquetas;
- fechas;
- ordenamiento;
- navegación;
- cálculo de completitud del perfil;
- control del rango personalizado.

## `js/ui/charts.js`

Contiene la lógica encargada de crear y actualizar los gráficos con Chart.js.

## `js/ui/insights.js`

Gestiona los indicadores financieros y el panel de planificación.

## `js/ui/modals.js`

Centraliza apertura y cierre de modales.

## `js/ui/render.js`

Se encarga principalmente del renderizado visual de los movimientos.

## `js/ui/toast.js`

Muestra mensajes temporales de:

```text
éxito
error
advertencia
información
```

---

# 7. Flujo general de la aplicación

El flujo principal puede resumirse así:

```text
Usuario abre KenFinance
        │
        ▼
Inicialización del frontend
        │
        ▼
Firebase comprueba autenticación
        │
        ├──────── No autenticado
        │               │
        │               ▼
        │             Login
        │
        └──────── Autenticado
                        │
                        ▼
                   Dashboard
                        │
              ┌─────────┼─────────┐
              ▼         ▼         ▼
           Perfil    Cuentas   Movimientos
              │         │         │
              └─────────┼─────────┘
                        ▼
                Cálculos financieros
                        │
                        ▼
               Actualización de UI
```

Firebase Authentication determina automáticamente si el usuario tiene una sesión activa.

---

# 8. Estado de la aplicación

El estado central se encuentra en:

```text
js/state.js
```

Ejemplos de información administrada:

```text
currentUser
currentFilter
currentLoadToken
isOnline
currentSort
exportPeriod
customRangeStart
customRangeEnd
planConfig
userProfile
```

## Estado persistente

Algunas preferencias permanecen después de cerrar o actualizar la página mediante `localStorage`.

Entre ellas:

```text
KenFinance.sort
KenFinance.export.period
KenFinance.range.start
KenFinance.range.end
KenFinance.theme
```

Esto permite conservar determinadas preferencias de interfaz.

---

# 9. Firebase

Firebase cumple dos funciones principales.

```text
Firebase
│
├── Authentication
│
└── Cloud Firestore
```

## Authentication

Gestiona:

- usuarios;
- sesión;
- email/contraseña;
- Google;
- recuperación de contraseña.

## Firestore

Gestiona los datos persistentes de KenFinance.

---

# 10. Autenticación

KenFinance v1.0 soporta:

### Email y contraseña

```text
Registro
Inicio de sesión
Cierre de sesión
Recuperación de contraseña
```

### Google

El login utiliza `GoogleAuthProvider` y abre el selector de cuentas de Google.

La sesión se observa mediante `onAuthStateChanged`.

Esto permite que KenFinance cambie automáticamente entre:

```text
Login
↕
Dashboard
```

dependiendo del estado del usuario.

---

# 11. Perfil de usuario

Cada usuario puede almacenar información adicional de perfil.

Los campos utilizados por v1.0 incluyen:

```text
name
phone
birthday
city
country
occupation
currency
monthlyTarget
bio
recoveryEmail
emergencyContact
```

La moneda base utilizada inicialmente es:

```text
PEN
```

La aplicación también calcula el porcentaje de completitud del perfil.

El perfil se almacena en:

```text
users/{uid}
```

---

# 12. Modelo de datos

La estructura principal utilizada por Firestore es:

```text
users/
│
└── {uid}
    │
    ├── name
    ├── phone
    ├── birthday
    ├── city
    ├── country
    ├── occupation
    ├── currency
    ├── monthlyTarget
    ├── bio
    ├── recoveryEmail
    ├── emergencyContact
    ├── planConfig
    │
    └── assets/
        └── {assetId}

transactions/
│
└── {uid}
    │
    ├── income/
    │   └── {transactionId}
    │
    └── expenses/
        └── {transactionId}

plans/
│
└── {uid}
```

El `uid` de Firebase Authentication permite separar la información perteneciente a cada usuario.

---

# 13. Cuentas y activos

Las cuentas del usuario se representan internamente como:

```text
assets
```

y se almacenan en:

```text
users/{uid}/assets/{assetId}
```

Los tipos disponibles en v1.0 son:

```text
bank_account
wallet
cash
credit_card
crypto
```

En la interfaz se representan como:

```text
Cuenta bancaria
Billetera digital
Efectivo
Tarjeta de crédito
Criptomonedas
```

## Monedas

v1.0 permite asignar a una cuenta:

```text
PEN
USD
EUR
```

Cada cuenta conserva su propia moneda.

## Creación

Una cuenta contiene principalmente:

```text
name
type
currency
active
createdAt
updatedAt
```

## Edición

Una cuenta existente puede modificar sus datos descriptivos.

El saldo no se edita como un campo independiente almacenado en la cuenta.

## Archivado

KenFinance utiliza archivado lógico.

Cuando una cuenta se elimina desde la interfaz, internamente puede quedar marcada como:

```text
active: false
```

junto con:

```text
archivedAt
updatedAt
```

Las cuentas inactivas quedan fuera de las consultas normales.

## Restricción por saldo

Una cuenta con saldo distinto de cero no debe archivarse directamente.

La interfaz solicita primero dejar su saldo en:

```text
0
```

Esto ayuda a evitar inconsistencias financieras.

---

# 14. Saldo inicial

Al crear una nueva cuenta, el usuario puede indicar un saldo inicial.

Ejemplo:

```text
Cuenta: Yape
Moneda: PEN
Saldo inicial: S/ 100
```

KenFinance no guarda simplemente `balance: 100` dentro de la cuenta.

En su lugar crea un movimiento especial:

```text
amount
date
note: "Saldo inicial"
source: "otros"
assetId
isInitialBalance: true
```

De esta forma el saldo puede seguir calculándose utilizando el historial de movimientos.

## Tratamiento financiero

El saldo inicial:

```text
SÍ
→ aumenta el saldo de la cuenta
```

pero:

```text
NO
→ se considera un ingreso generado durante el período
```

Por ejemplo:

```text
Nueva cuenta
Saldo inicial: S/500
```

debe producir:

```text
Saldo de la cuenta: S/500
```

pero no:

```text
Ingresos del día: S/500
```

---

# 15. Ingresos

Los ingresos se almacenan en:

```text
transactions/{uid}/income/{transactionId}
```

Un ingreso puede contener:

```text
amount
date
source
assetId
tags
note
createdAt
```

## Fuente

Las opciones actuales incluyen:

```text
salario
freelance
negocio
otros
```

## Cuenta

Cada ingreso debe estar asociado a una cuenta mediante:

```text
assetId
```

El movimiento aumenta el saldo calculado de esa cuenta.

## Etiquetas

Los ingresos admiten etiquetas opcionales.

## Nota

El usuario puede añadir una descripción libre al movimiento.

---

# 16. Gastos

Los gastos se almacenan en:

```text
transactions/{uid}/expenses/{transactionId}
```

Un gasto puede contener:

```text
amount
date
assetId
category
merchant
method
priority
note
createdAt
```

## Cuenta de origen

Todo gasto debe vincularse a la cuenta desde la que salió el dinero.

El movimiento reduce el saldo calculado de esa cuenta.

## Categorías

Las categorías de v1.0 son:

```text
green  → Fijo
yellow → Necesario
red    → Antojo
```

## Comercio o proveedor

Puede almacenarse opcionalmente mediante `merchant`.

## Método de pago

Las opciones contempladas son:

```text
efectivo
debito
credito
transferencia
billetera
```

## Prioridad

Los gastos pueden indicar:

```text
alta
media
baja
```

---

# 17. Cálculo de saldos de cuentas

Una de las decisiones centrales de la Fase 1 fue no mantener el saldo como un número fijo independiente del historial.

El saldo se obtiene mediante los movimientos asociados al `assetId`.

Conceptualmente:

```text
Saldo de cuenta
=
Σ ingresos de la cuenta
-
Σ gastos de la cuenta
```

Ejemplo:

```text
Yape

Saldo inicial      + S/100
Ingreso trabajo    + S/ 50
Gasolina           - S/ 20
Comida             - S/ 15
───────────────────────────
Saldo actual         S/115
```

Esto mantiene una relación directa entre:

```text
historial
↕
saldo calculado
```

---

# 18. Saldo total de cuentas

KenFinance suma los saldos de las cuentas activas agrupándolos por moneda.

Ejemplo:

```text
Yape       PEN     S/ 100
BCP        PEN     S/ 500
Efectivo   PEN     S/  50

Saldo PEN          S/ 650
```

Si existen otras monedas:

```text
PEN    S/ 650
USD    $  30
EUR    €  20
```

se muestran independientemente.

v1.0 no convierte automáticamente monedas entre sí.

Por ello:

```text
S/500 + US$20
```

no debe presentarse como:

```text
S/520
```

---

# 19. Dashboard y balance del período

El dashboard calcula información financiera en función del período seleccionado.

El cálculo principal es:

```text
Balance
=
Ingresos del período
-
Gastos del período
```

Los movimientos marcados como:

```text
isInitialBalance: true
```

se excluyen del total de ingresos.

## Flujo simplificado de `loadData()`

```text
Determinar período
        │
        ▼
Consultar movimientos
        │
        ▼
Filtrar fechas
        │
        ▼
Separar ingresos y gastos
        │
        ▼
Excluir saldos iniciales
        │
        ▼
Calcular totales
        │
        ▼
Calcular balance
        │
        ▼
Aplicar búsqueda/categoría
        │
        ▼
Ordenar
        │
        ├── Actualizar indicadores
        ├── Actualizar plan
        ├── Renderizar movimientos
        └── Renderizar gráficos
```

## Protección frente a race conditions

La aplicación utiliza:

```text
currentLoadToken
```

Cada nueva carga obtiene un token.

Si una consulta anterior termina después que una consulta más reciente, su resultado puede ignorarse.

Esto evita que una respuesta antigua sobrescriba información más nueva en la interfaz.

---

# 20. Filtros temporales

v1.0 permite filtrar movimientos por:

```text
Hoy
7 días
Mes
Rango
```

## Hoy

Desde las `00:00:00` del día actual.

## 7 días

Incluye:

```text
día actual
+
6 días calendario anteriores
```

## Mes

Empieza el primer día del mes actual.

## Rango

Permite escoger:

```text
fecha inicial
fecha final
```

y filtrar los movimientos incluidos dentro de ese intervalo.

El rango seleccionado puede almacenarse temporalmente en `localStorage`.

---

# 21. Búsqueda y filtros

La versión 1.0 dispone de un buscador de movimientos.

La búsqueda utiliza principalmente:

```text
nota
monto
```

La búsqueda y el filtro de categoría pueden combinarse.

## Categoría

El filtro permite mostrar:

```text
Todos
Ingresos
Fijo
Necesario
Antojo
```

## Debounce

La interacción del buscador utiliza una pequeña espera antes de refrescar resultados para evitar actualizaciones innecesarias durante cada pulsación rápida del teclado.

---

# 22. Ordenamiento

Los movimientos pueden ordenarse mediante:

```text
date_desc
date_asc
amount_desc
amount_asc
```

Esto permite ordenar por:

```text
Más reciente
Más antiguo
Mayor monto
Menor monto
```

La preferencia seleccionada puede persistirse en:

```text
KenFinance.sort
```

---

# 23. Gráficos

KenFinance v1.0 utiliza:

```text
Chart.js
```

`app.js` delega el renderizado a:

```text
js/ui/charts.js
```

Los dos gráficos existentes son:

## Ingresos vs Gastos

Gráfico comparativo entre:

```text
Ingresos
Gastos
```

del período seleccionado.

## Gastos por categoría

Visualiza cómo se distribuyen los gastos entre:

```text
Fijo
Necesario
Antojo
```

Los gráficos se actualizan cuando cambian los datos del período.

---

# 24. Insights financieros

KenFinance contiene una sección de indicadores calculados desde los movimientos.

Entre los indicadores disponibles se encuentran:

```text
Tasa de ahorro
Runway estimado
Categoría dominante
Burn diario
```

Además existe un panel estratégico relacionado con el comportamiento financiero y el plan configurado.

La lógica se encuentra principalmente en:

```text
js/ui/insights.js
```

`app.js` entrega al módulo información como:

```text
totalIncome
totalExpenses
balance
expenseItems
periodDays
```

---

# 25. Plan financiero

v1.0 permite configurar dos valores principales:

```text
incomeTarget
expenseLimit
```

Es decir:

```text
objetivo de ingresos
límite de gastos
```

La configuración se intenta almacenar en:

```text
plans/{uid}
```

Existe además compatibilidad con:

```text
users/{uid}.planConfig
```

El dashboard utiliza esta información para generar indicadores relacionados con el desempeño financiero.

---

# 26. Reportes Excel

La exportación Excel se encuentra en:

```text
js/services/exportService.js
```

Utiliza:

```text
SheetJS
```

La librería se carga cuando se solicita la exportación.

## Períodos

Los reportes implementados contemplan:

```text
Semanal
Mensual
```

## Hojas

El archivo generado incluye:

```text
Resumen
Ingresos
Gastos
Analisis
```

### Resumen

Incluye información como:

```text
período
usuario/correo
ingresos
gastos
balance
análisis general
```

### Ingresos

Incluye los movimientos de ingreso del período.

### Gastos

Incluye los movimientos de gasto.

### Analisis

Agrupa información de gastos según:

```text
Fijo
Necesario
Antojo
```

## Saldo inicial

Los movimientos con:

```text
isInitialBalance: true
```

no se contabilizan como ingresos reales dentro de los totales del reporte.

---

# 27. Reportes PDF

Los PDF utilizan:

```text
jsPDF
```

y se generan desde:

```text
exportService.js
```

Incluyen principalmente:

```text
tipo de reporte
fecha de generación
balance
ingresos
gastos
lista de movimientos
```

## Paginación

Si las transacciones exceden el espacio de una página, el sistema puede crear páginas adicionales.

## Períodos

Al igual que Excel:

```text
Semanal
Mensual
```

## Saldo inicial

También queda excluido del cálculo de ingresos reales.

---

# 28. Tema claro y oscuro

KenFinance v1.0 permite cambiar entre:

```text
Light Mode
Dark Mode
```

La inicialización consulta primero:

```text
KenFinance.theme
```

en `localStorage`.

Si todavía no existe una selección, utiliza:

```text
prefers-color-scheme
```

del sistema operativo/navegador.

## Flujo

```text
Abrir aplicación
      │
      ▼
¿Hay tema guardado?
      │
  ┌───┴───┐
  Sí      No
  │        │
  ▼        ▼
Usarlo   Sistema
```

---

# 29. Modales, toasts y renderizado

## Modales

Los formularios y confirmaciones utilizan ventanas modales.

La lógica general se concentra en:

```text
js/ui/modals.js
```

## Toasts

Los mensajes temporales se gestionan desde:

```text
js/ui/toast.js
```

Ejemplos:

```text
Cuenta creada
Ingreso guardado
Error al cargar
Sin conexión
Perfil actualizado
```

## Renderizado de movimientos

El listado de movimientos se genera desde:

```text
js/ui/render.js
```

El objetivo es evitar que `app.js` tenga que construir toda la presentación visual de cada registro.

---

# 30. PWA

KenFinance incluye soporte para Progressive Web App mediante:

```text
manifest.json
service-worker.js
icons/
```

## Iconos

Se incluyen tamaños:

```text
72×72
96×96
128×128
144×144
152×152
192×192
384×384
512×512
```

## Service Worker

La aplicación registra un Service Worker para manejar recursos relacionados con la PWA y caché.

Durante desarrollo local existe tratamiento especial para evitar que una versión almacenada en caché dificulte la prueba de cambios recientes.

---

# 31. Conectividad

El estado incluye:

```text
isOnline
```

inicializado mediante:

```text
navigator.onLine
```

También se escuchan eventos:

```text
online
offline
```

para actualizar el estado.

## Operaciones protegidas

Las principales operaciones de escritura relacionadas con:

```text
cuentas
ingresos
gastos
```

comprueban la conectividad antes de guardar.

## Importante

KenFinance v1.0 tiene capacidades PWA, pero no debe considerarse una aplicación completamente offline-first.

---

# 32. Seguridad y validaciones

KenFinance aplica validaciones tanto en formularios como en la lógica JavaScript.

Ejemplos:

```text
montos positivos
límites máximos
fechas válidas
cuenta obligatoria
tipo de cuenta válido
moneda válida
nombre obligatorio
longitudes máximas de textos
normalización de notas
normalización de etiquetas
```

## Montos

Antes de guardar se comprueba que los montos:

```text
sean números
sean positivos
no excedan el máximo permitido
```

También se redondean al nivel de centavos cuando corresponde.

## Estado de botones

Durante determinadas operaciones asíncronas el botón puede quedar temporalmente deshabilitado para reducir múltiples envíos accidentales.

## Firebase Authentication

La autenticación se gestiona mediante Firebase Authentication y no mediante un sistema casero de contraseñas.

## Firestore Rules

El proyecto contiene:

```text
firestore.rules
```

Este archivo define las reglas de seguridad de Cloud Firestore.

La autorización real de los datos almacenados en Firestore depende de estas reglas y no solamente de validaciones JavaScript del frontend.

## Content Security Policy

`index.html` incluye una Content Security Policy para limitar los orígenes utilizados por scripts, estilos, fuentes, conexiones, frames e imágenes.

## Configuración Firebase

La configuración frontend de Firebase no debe considerarse una contraseña.

La protección de los datos depende principalmente de:

```text
Authentication
+
Firestore Security Rules
```

---

# 33. Desarrollo local

El proyecto contiene:

```text
package.json
```

con versión:

```text
1.0.0
```

## Requisitos

Se recomienda disponer de:

```text
Node.js
npm
navegador moderno
```

## Instalar

Desde la raíz:

```bash
npm install
```

## Iniciar servidor de desarrollo

```bash
npm run dev
```

El script configurado ejecuta:

```text
npx -y serve .
```

## Por qué utilizar servidor HTTP

No se recomienda ejecutar directamente:

```text
file://index.html
```

porque KenFinance utiliza ES Modules, Firebase, Service Worker y políticas de seguridad del navegador que funcionan correctamente cuando la aplicación se sirve mediante HTTP/HTTPS.

---

# 34. Lint

El proyecto utiliza ESLint.

Para revisar JavaScript:

```bash
npm run lint
```

El script configurado ejecuta:

```text
npx -y eslint js/
```

Por tanto, ESLint analiza el código JavaScript ubicado dentro de:

```text
js/
```

---

# 35. Limitaciones de v1.0

Esta sección documenta únicamente limitaciones técnicas del estado actual.

## Conversión multimoneda

Las cuentas soportan:

```text
PEN
USD
EUR
```

pero no existe conversión automática.

Los saldos se muestran separados por moneda.

## Transferencias internas

v1.0 no dispone de un movimiento específico para transferir dinero entre dos cuentas propias.

## Saldo consolidado entre monedas

No existe un saldo total convertido a una única moneda.

## Navegación

La interfaz v1.0 continúa concentrada principalmente en:

```text
index.html
```

y utiliza una experiencia de página/dashboard única.

## Framework frontend

v1.0 utiliza JavaScript modular directamente y no utiliza framework frontend.

## Offline

La aplicación no implementa sincronización offline completa para todas las operaciones.

## Metas financieras

Aunque existe código de acceso a datos relacionado con `goals` dentro del servicio de base de datos, v1.0 no dispone de un módulo completo de metas integrado a la interfaz principal.

Por tanto, no se considera una funcionalidad terminada de esta versión.

## Tests automatizados

No existe una suite automatizada completa que cubra todos los flujos de KenFinance.

Las comprobaciones realizadas en esta fase han sido principalmente funcionales/manuales y mediante lint.

---

# 36. Estado técnico de v1.0

KenFinance v1.0 cierra la Fase 1 con esta arquitectura:

```text
KenFinance v1.0
│
├── HTML
│   └── index.html
│
├── CSS
│   └── styles.css
│
├── JavaScript ES Modules
│   ├── app.js
│   ├── state.js
│   ├── firebase/
│   ├── services/
│   └── ui/
│
├── Firebase
│   ├── Authentication
│   └── Cloud Firestore
│
├── Chart.js
│
├── Reportes
│   ├── SheetJS
│   └── jsPDF
│
├── PWA
│   ├── manifest.json
│   ├── service-worker.js
│   └── icons/
│
└── Configuración de despliegue
    ├── vercel.json
    ├── firebase.json
    └── _redirects
```

## Funcionalidades principales documentadas

```text
✅ Autenticación Email/Password
✅ Autenticación Google
✅ Recuperación de contraseña
✅ Perfil de usuario
✅ Registro de ingresos
✅ Registro de gastos
✅ Edición de movimientos
✅ Eliminación de movimientos
✅ Gestión de cuentas
✅ Saldo inicial
✅ Asociación de movimiento → cuenta
✅ Saldo dinámico por cuenta
✅ Saldo total separado por moneda
✅ PEN / USD / EUR
✅ Filtros temporales
✅ Rango personalizado
✅ Búsqueda
✅ Ordenamiento
✅ Gráficos
✅ Insights
✅ Plan financiero
✅ Excel
✅ PDF
✅ Tema claro/oscuro
✅ PWA
✅ Detección de conectividad
```

---

# 📌 Alcance de esta documentación

Esta guía corresponde exclusivamente a:

**KenFinance v1.0 — Fase 1**

Describe la estructura y arquitectura JavaScript modular existente al cierre de esta versión.

No documenta rediseños, migraciones de tecnología ni funcionalidades que todavía no forman parte del código de v1.0.
