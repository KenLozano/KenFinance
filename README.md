# 💰 KenFinance

> **Gestión de finanzas personales simple, visual y organizada.**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![PWA](https://img.shields.io/badge/PWA-Instalable-blueviolet)
![Firebase](https://img.shields.io/badge/Firebase-Authentication%20%2B%20Firestore-orange)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📌 Descripción

**KenFinance** es una aplicación web progresiva (**PWA**) orientada a la gestión de finanzas personales.

Permite registrar ingresos y gastos, organizar el dinero por cuentas, analizar el comportamiento financiero, establecer objetivos de ingresos y límites de gasto, consultar métricas financieras y exportar información mediante reportes en Excel y PDF.

La versión **1.0.0** representa la primera base estable del proyecto y establece la arquitectura sobre la que se desarrollarán futuras funcionalidades de KenFinance.

---

## ✨ Funcionalidades principales

### 🔐 Autenticación

- Registro mediante correo electrónico y contraseña.
- Inicio de sesión mediante correo electrónico.
- Inicio de sesión con Google.
- Recuperación de contraseña.
- Cierre de sesión.
- Gestión básica del perfil del usuario.

---

### 👤 Perfil de usuario

El usuario puede registrar y actualizar información personal como:

- Nombre.
- Teléfono.
- Fecha de nacimiento.
- Ciudad.
- País.
- Ocupación.
- Moneda principal.
- Objetivo de ahorro mensual.
- Correo alternativo de recuperación.
- Contacto de emergencia.
- Biografía.

La aplicación también calcula el porcentaje de completitud del perfil.

---

## 💳 Gestión de cuentas

KenFinance permite registrar las cuentas donde el usuario mantiene su dinero.

Tipos disponibles:

- 🏦 Cuenta bancaria.
- 📱 Billetera digital.
- 💵 Efectivo.
- 💳 Tarjeta de crédito.
- ₿ Criptomonedas.

Cada cuenta puede utilizar una de las siguientes monedas:

- PEN — Sol peruano.
- USD — Dólar estadounidense.
- EUR — Euro.

Las cuentas muestran su saldo calculado a partir de los movimientos asociados.

### Saldo inicial

Al crear una cuenta puede definirse un saldo inicial.

Este saldo no se almacena como un valor fijo dentro de la cuenta, sino que se registra como un **movimiento de ingreso especial**, permitiendo mantener consistencia con el historial financiero.

### Eliminación de cuentas

Las cuentas no se eliminan físicamente de Firestore.

KenFinance utiliza **archivado lógico**, marcándolas como inactivas.

Además, una cuenta no puede archivarse mientras mantenga un saldo diferente de cero.

---

## 💵 Ingresos

Los ingresos pueden registrar:

- Monto.
- Fecha.
- Fuente.
- Cuenta de destino.
- Etiquetas.
- Nota.

Fuentes disponibles actualmente:

- Salario.
- Freelance.
- Negocio.
- Otros.

Todo ingreso debe estar asociado a una cuenta mediante su identificador interno.

---

## 💸 Gastos

Los gastos pueden registrar:

- Monto.
- Fecha.
- Cuenta de origen.
- Categoría.
- Comercio o proveedor.
- Método de pago.
- Prioridad.
- Nota.

### Categorías actuales

- 🟢 **Fijo**
- 🟡 **Necesario**
- 🔴 **Antojo**

### Métodos de pago

- Efectivo.
- Tarjeta de débito.
- Tarjeta de crédito.
- Transferencia.
- Billetera digital.

### Prioridad

- Alta.
- Media.
- Baja.

---

## 📊 Dashboard financiero

El dashboard muestra información correspondiente al periodo seleccionado.

Incluye:

- Balance.
- Total de ingresos.
- Total de gastos.
- Tasa de ahorro.
- Runway estimado.
- Categoría de gasto dominante.
- Burn diario.
- Anomalías detectadas.

También incluye un panel estratégico con:

- Proyección de cierre.
- Desviación frente al objetivo.
- Score de salud financiera.
- Progreso respecto al límite mensual de gasto.

---

## 🎯 Plan financiero

El usuario puede establecer:

- **Ingreso objetivo mensual.**
- **Límite de gasto mensual.**

A partir de estos valores KenFinance genera diferentes indicadores para ayudar a visualizar el comportamiento financiero durante el periodo.

---

## 🔎 Búsqueda, filtros y ordenamiento

KenFinance permite consultar los movimientos mediante diferentes herramientas.

### Periodos

- Hoy.
- Últimos 7 días.
- Mes actual.
- Rango personalizado.

### Búsqueda

La búsqueda permite encontrar movimientos utilizando el contenido de sus notas o montos.

Se utiliza un sistema de **debounce** para evitar ejecuciones innecesarias mientras el usuario escribe.

### Filtro por categoría

Es posible mostrar:

- Todas las categorías.
- Ingresos.
- Gastos fijos.
- Gastos necesarios.
- Antojos.

### Ordenamiento

Los movimientos pueden ordenarse por:

- Más recientes.
- Más antiguos.
- Mayor monto.
- Menor monto.

Algunas preferencias de interfaz se conservan mediante `localStorage`.

---

## 📈 Gráficos

KenFinance utiliza **Chart.js** para representar visualmente la información financiera.

Actualmente incluye:

### Ingresos vs Gastos

Comparación gráfica entre los ingresos y gastos del periodo seleccionado.

### Gastos por categoría

Distribución de los gastos entre:

- Fijo.
- Necesario.
- Antojo.

---

## 📤 Exportación de reportes

KenFinance permite generar reportes:

- Semanales.
- Mensuales.

### Excel

La exportación Excel utiliza **SheetJS**.

El archivo generado contiene:

1. **Resumen**
2. **Ingresos**
3. **Gastos**
4. **Análisis por categoría**

Incluye información como:

- Ingresos totales.
- Gastos totales.
- Balance.
- Tasa de ahorro.
- Distribución de gastos.
- Número de transacciones.

### PDF

La exportación PDF utiliza **jsPDF**.

Incluye:

- Balance.
- Ingresos.
- Gastos.
- Movimientos del periodo.
- Fecha de generación.
- Paginación automática.

Las librerías de exportación se cargan solamente cuando son necesarias para reducir la carga inicial de la aplicación.

---

## 🌓 Tema claro y oscuro

KenFinance dispone de:

- Tema claro.
- Tema oscuro.
- Detección inicial de la preferencia del sistema.

La selección del usuario se guarda localmente para mantenerla en futuras sesiones.

---

## 📱 Progressive Web App

KenFinance funciona como una **Progressive Web App (PWA)**.

Incluye:

- `manifest.json`.
- Service Worker.
- Iconos para diferentes resoluciones.
- Posibilidad de instalación desde navegadores compatibles.
- Caché de recursos.
- Detección de nuevas versiones.

Cuando existe una nueva versión del Service Worker, la aplicación puede solicitar al usuario recargar para actualizar KenFinance.

Durante desarrollo local, el Service Worker se desactiva para evitar problemas derivados de caché antigua.

---

## 🌐 Conectividad

KenFinance detecta si el dispositivo está:

- Online.
- Offline.

Las operaciones que requieren escritura en Firebase se bloquean cuando no existe conexión para evitar operaciones incompletas o inconsistentes.

---

# 🏗️ Arquitectura

KenFinance utiliza una arquitectura modular basada en **JavaScript ES Modules**.

```text
KenFinance/
│
├── index.html
├── manifest.json
├── service-worker.js
├── vercel.json
│
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
│
├── package.json
├── package-lock.json
├── eslint.config.cjs
│
├── README.md
├── DEPLOYMENT.md
├── GUIA_TECNICA_COMPLETA.md
├── privacy.html
├── terms.html
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

---

## 🧩 Organización del código

### `js/app.js`

Punto de entrada principal de la aplicación.

Se encarga principalmente de:

- Inicialización.
- Coordinación entre módulos.
- Eventos de interfaz.
- Gestión de cuentas.
- Gestión de movimientos.
- Perfil.
- Filtros.
- Autenticación.
- Exportaciones.
- Inicialización de la PWA.

---

### `js/state.js`

Contiene el estado central de la aplicación.

Administra información como:

- Usuario actual.
- Filtro seleccionado.
- Estado de conectividad.
- Ordenamiento.
- Periodo de exportación.
- Rango personalizado.
- Configuración del plan financiero.
- Perfil.

También conserva determinadas preferencias mediante `localStorage`.

---

### `js/services/authService.js`

Abstrae las operaciones relacionadas con Firebase Authentication:

- Login.
- Registro.
- Login con Google.
- Logout.
- Recuperación de contraseña.
- Actualización del nombre del usuario.

---

### `js/services/dbService.js`

Centraliza las operaciones con Cloud Firestore.

Gestiona:

- Usuarios.
- Transacciones.
- Plan financiero.
- Cuentas.
- Metas preparadas a nivel de datos.
- Cálculo de saldos.

---

### `js/services/exportService.js`

Gestiona la generación de:

- Excel.
- PDF.

Las dependencias se cargan mediante **lazy loading** únicamente cuando se solicita una exportación.

---

### `js/ui/`

Contiene módulos especializados en presentación e interacción:

```text
charts.js
helpers.js
insights.js
modals.js
render.js
toast.js
```

Esta separación evita concentrar toda la lógica de interfaz en `app.js`.

---

# 🔥 Firebase

KenFinance utiliza Firebase como Backend as a Service.

### Firebase Authentication

Gestiona la identidad y sesión de los usuarios.

### Cloud Firestore

Almacena los datos financieros.

La estructura general utilizada actualmente sigue este modelo:

```text
users/
└── {uid}
    ├── información del perfil
    │
    ├── assets/
    │   └── {assetId}
    │
    └── goals/
        └── {goalId}

transactions/
└── {uid}
    ├── income/
    │   └── {transactionId}
    │
    └── expenses/
        └── {transactionId}

plans/
└── {uid}
```

Cada movimiento puede relacionarse con una cuenta mediante:

```text
assetId
```

---

## 💰 Cálculo de saldos

KenFinance no mantiene el saldo de una cuenta como una cifra independiente que deba actualizarse manualmente.

El saldo se calcula utilizando sus movimientos:

```text
Saldo =
Ingresos asociados
-
Gastos asociados
```

Esto reduce el riesgo de inconsistencias entre el historial y el saldo de una cuenta.

---

# 🛠️ Tecnologías

### Frontend

- HTML5.
- CSS3.
- JavaScript ES6+.
- JavaScript Modules.

### Backend / BaaS

- Firebase Authentication.
- Cloud Firestore.

### Visualización

- Chart.js.

### Reportes

- SheetJS.
- jsPDF.

### PWA

- Web App Manifest.
- Service Worker.

### Hosting

- Vercel.

---

# ⚙️ Desarrollo local

## Requisitos

Se recomienda disponer de:

- Git.
- Node.js.
- npm.
- Navegador moderno.

---

## 1. Clonar el repositorio

```bash
git clone https://github.com/KenLozano/KenFinance.git
```

Entrar al proyecto:

```bash
cd KenFinance
```

---

## 2. Instalar dependencias

```bash
npm install
```

---

## 3. Ejecutar entorno local

```bash
npm run dev
```

El comando utiliza un servidor HTTP local para servir el proyecto.

---

## 4. Ejecutar ESLint

```bash
npm run lint
```

---

# 🔧 Configuración de Firebase

KenFinance necesita una configuración válida de Firebase.

La configuración se gestiona mediante:

```text
js/firebase/config.js
js/firebase/runtime-config.js
```

Además deben estar habilitados los servicios utilizados por la aplicación:

- Firebase Authentication.
- Email/Password.
- Google Authentication.
- Cloud Firestore.

Los dominios utilizados en producción deben estar configurados dentro de los dominios autorizados de Firebase Authentication.

---

# 🚀 Deployment

El despliegue principal de KenFinance utiliza:

```text
GitHub
   ↓
Vercel
   ↓
KenFinance
   ↓
Firebase
```

Vercel publica automáticamente nuevas versiones cuando se actualiza la rama configurada para producción.

El proyecto incluye:

```text
vercel.json
```

para la configuración específica del hosting.

Firebase Hosting y Netlify pueden utilizarse como alternativas, pero **Vercel es actualmente la plataforma principal del proyecto**.

La documentación detallada de despliegue se encuentra en:

```text
DEPLOYMENT.md
```

---

# 💱 Soporte multimoneda

Las cuentas pueden configurarse utilizando:

- PEN.
- USD.
- EUR.

Actualmente KenFinance mantiene separados los saldos de las cuentas según su moneda.

> **Limitación v1.0:** KenFinance todavía no realiza conversión automática de divisas ni consolidación patrimonial utilizando tipos de cambio.

El soporte multimoneda avanzado forma parte de la evolución futura del proyecto.

---

# 🔒 Seguridad

KenFinance utiliza:

- Firebase Authentication.
- Firestore Security Rules.
- Content Security Policy.
- Validación de entradas.
- Normalización de texto.
- HTTPS en producción.
- Separación de datos por usuario.

La configuración de seguridad debe mantenerse sincronizada con la estructura utilizada en Firestore.

---

# 📋 Estado del proyecto

### KenFinance v1.0.0

La versión 1.0 establece la primera base funcional del proyecto.

Incluye:

- ✅ Autenticación.
- ✅ Login con Google.
- ✅ Recuperación de contraseña.
- ✅ Perfil de usuario.
- ✅ Gestión de cuentas.
- ✅ Saldo por cuenta.
- ✅ Ingresos.
- ✅ Gastos.
- ✅ Filtros.
- ✅ Búsqueda.
- ✅ Ordenamiento.
- ✅ Gráficos.
- ✅ Indicadores financieros.
- ✅ Plan financiero.
- ✅ Exportación Excel.
- ✅ Exportación PDF.
- ✅ Tema claro/oscuro.
- ✅ PWA.
- ✅ Deployment con Vercel.

---

# 🗺️ Roadmap

KenFinance continuará evolucionando sobre la arquitectura establecida en v1.0.

Las funcionalidades siguientes representan la dirección actual del proyecto y pueden reorganizarse conforme avance el desarrollo.

## 🔜 Próximas fases

- [ ] Transferencias entre cuentas.
- [ ] Evolución del sistema de categorías.
- [ ] Categorías personalizables.
- [ ] Sistema completo de metas financieras.
- [ ] Mejoras en análisis e indicadores.
- [ ] Historial financiero más avanzado.
- [ ] Mejoras en reportes.
- [ ] Gestión multimoneda avanzada.
- [ ] Conversión entre monedas.
- [ ] Mejoras de experiencia móvil.

---

## 💡 Visión futura

Entre las funcionalidades consideradas para futuras versiones se encuentran:

- [ ] Gestión de deudas.
- [ ] Préstamos y amortizaciones.
- [ ] Suscripciones y pagos recurrentes.
- [ ] Calendario financiero.
- [ ] Recordatorios.
- [ ] Fondo de emergencia.
- [ ] Patrimonio neto.
- [ ] Gestión de inversiones.
- [ ] Criptomonedas.
- [ ] Importación de movimientos.
- [ ] OCR para recibos.
- [ ] Automatizaciones.
- [ ] Análisis financiero inteligente.
- [ ] Recomendaciones personalizadas.
- [ ] Predicción de flujo de caja.

El objetivo a largo plazo es que KenFinance evolucione desde un gestor de movimientos hacia una **plataforma integral de finanzas personales**.

---

# 🧪 Verificación

Antes de publicar una nueva versión se recomienda comprobar:

- Registro.
- Login.
- Login con Google.
- Recuperación de contraseña.
- Perfil.
- Creación de cuentas.
- Edición de cuentas.
- Archivado de cuentas.
- Registro de ingresos.
- Registro de gastos.
- Actualización de saldos.
- Filtros.
- Búsqueda.
- Ordenamiento.
- Plan financiero.
- Gráficos.
- Exportación Excel.
- Exportación PDF.
- Tema claro/oscuro.
- Service Worker.
- Instalación PWA.
- ESLint.

---

# 📄 Licencia

Este proyecto utiliza la licencia **MIT**.

Consulta el archivo de licencia del repositorio para conocer sus condiciones.

---

# 👨‍💻 Autor

**Ken Lozano**

GitHub: **[@KenLozano](https://github.com/KenLozano)**

---

<div align="center">

### 💰 KenFinance

**Organiza hoy. Entiende mañana. Decide mejor.**

Versión **1.0.0**

</div>
