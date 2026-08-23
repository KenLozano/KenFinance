# 💰 KenFinance

> **Gestión de finanzas personales simple, visual y organizada.**

![Estado](https://img.shields.io/badge/Estado-Preparada%20para%20release-yellow)
![Versión](https://img.shields.io/badge/Versión-1.0.0-blue)
![PWA](https://img.shields.io/badge/PWA-Instalable-blueviolet)
![Firebase](https://img.shields.io/badge/Firebase-Authentication%20%2B%20Firestore-orange)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-black)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green)

---

## 📌 Descripción

**KenFinance** es una aplicación web de finanzas personales orientada al registro, organización y análisis de ingresos, gastos y cuentas financieras.

La versión **1.0.0** representa el cierre de la **Fase 1** del proyecto y consolida una base funcional con:

- autenticación;
- perfil de usuario;
- cuentas financieras;
- ingresos y gastos;
- saldo dinámico por cuenta;
- filtros y búsqueda;
- gráficos;
- indicadores financieros;
- plan financiero;
- exportación Excel/PDF;
- PWA;
- despliegue web con Vercel;
- persistencia mediante Firebase.

KenFinance v1.0 utiliza **HTML, CSS y JavaScript modular**, sin framework frontend.

---

## ✨ Funcionalidades principales

### 🔐 Autenticación

- Registro con correo y contraseña.
- Inicio de sesión con correo y contraseña.
- Inicio de sesión con Google.
- Recuperación de contraseña.
- Cierre de sesión.
- Persistencia de sesión mediante Firebase Authentication.

---

### 👤 Perfil de usuario

KenFinance permite almacenar información de perfil como:

- nombre;
- teléfono;
- fecha de nacimiento;
- ciudad;
- país;
- ocupación;
- moneda base;
- objetivo mensual;
- biografía;
- correo de recuperación;
- contacto de emergencia.

También calcula el porcentaje de completitud del perfil.

Parte de esta información puede utilizarse para personalizar los reportes generados.

---

### 💳 Cuentas financieras

Las cuentas se representan internamente mediante `assets`.

Tipos disponibles en v1.0:

- Cuenta bancaria.
- Billetera digital.
- Efectivo.
- Tarjeta de crédito.
- Criptomonedas.

Monedas disponibles:

- PEN.
- USD.
- EUR.

Cada movimiento se vincula a una cuenta real mediante:

```text
assetId
```

---

### 💰 Saldo inicial

Al crear una cuenta se puede registrar un saldo inicial.

KenFinance no mantiene ese saldo como un valor independiente dentro de la cuenta.

En su lugar crea un movimiento especial:

```text
Saldo inicial
+
assetId
+
isInitialBalance: true
```

Esto permite mantener consistencia entre el saldo de la cuenta y su historial.

El saldo inicial:

- sí aumenta el saldo de la cuenta;
- no se contabiliza como ingreso real en el dashboard;
- no se contabiliza como ingreso real en los reportes.

---

### 📥 Ingresos

Los ingresos pueden incluir:

- monto;
- fecha;
- fuente;
- cuenta;
- etiquetas;
- nota.

Cada ingreso aumenta el saldo de la cuenta asociada.

---

### 📤 Gastos

Los gastos pueden incluir:

- monto;
- fecha;
- cuenta;
- categoría;
- comercio o proveedor;
- método de pago;
- prioridad;
- nota.

Categorías actuales:

- 🟢 Fijo.
- 🟡 Necesario.
- 🔴 Antojo.

Cada gasto reduce el saldo de la cuenta asociada.

---

### 🏦 Saldo por cuenta

El saldo no se guarda como un número independiente.

Se calcula mediante:

```text
Saldo de cuenta
=
Σ ingresos
-
Σ gastos
```

Esto mantiene una relación directa entre:

```text
Historial
↕
Saldo calculado
```

---

### 🌍 Multimoneda

KenFinance v1.0 permite cuentas en:

```text
PEN
USD
EUR
```

Los saldos se mantienen separados por moneda.

Ejemplo:

```text
PEN    S/ 650
USD    $ 30
EUR    € 20
```

La versión 1.0 **no realiza conversión automática de monedas**.

---

### 📊 Dashboard

El dashboard calcula:

```text
Balance
=
Ingresos del período
-
Gastos del período
```

También muestra información relacionada con:

- ingresos;
- gastos;
- balance;
- cuentas;
- indicadores financieros;
- plan financiero;
- gráficos;
- movimientos.

---

### 📅 Filtros temporales

Filtros disponibles:

- Hoy.
- 7 días.
- Mes.
- Rango personalizado.

---

### 🔍 Búsqueda y ordenamiento

La búsqueda permite localizar movimientos principalmente mediante:

- nota;
- monto.

También existe filtro por categoría.

Ordenamientos disponibles:

- Más recientes.
- Más antiguos.
- Mayor monto.
- Menor monto.

Parte de estas preferencias se conserva mediante `localStorage`.

---

### 📈 Gráficos

KenFinance v1.0 utiliza **Chart.js**.

Gráficos disponibles:

#### Ingresos vs Gastos

Compara los totales del período seleccionado.

#### Distribución de gastos

Muestra la distribución entre:

```text
Fijo
Necesario
Antojo
```

---

### 🧠 Indicadores financieros

La aplicación incluye indicadores como:

- tasa de ahorro;
- runway estimado;
- categoría dominante;
- burn diario;
- indicadores relacionados con el plan financiero.

---

### 🎯 Plan financiero

El plan financiero permite configurar:

```text
Objetivo de ingresos
Límite de gastos
```

Estos valores se utilizan para generar información relacionada con el desempeño financiero del usuario.

---

## 📄 Reportes

KenFinance permite exportar información financiera en:

```text
Excel
PDF
```

Períodos disponibles:

- semanal;
- mensual.

---

### 📊 Excel

La exportación utiliza **SheetJS**.

El archivo incluye hojas como:

```text
Resumen
Ingresos
Gastos
Analisis
```

Los saldos iniciales se excluyen de los ingresos reales.

---

### 📑 PDF

La exportación utiliza **jsPDF**.

El reporte incluye:

- período;
- fecha de generación;
- información del usuario;
- balance;
- ingresos;
- gastos;
- movimientos;
- paginación cuando es necesaria.

Los saldos iniciales también se excluyen de los ingresos reales.

---

## 🎨 Interfaz

KenFinance v1.0 incluye:

- tema claro;
- tema oscuro;
- detección del tema del sistema;
- diseño responsive;
- modales;
- toasts;
- estados de carga;
- interfaz adaptable a escritorio y móvil.

La preferencia del tema se guarda localmente.

---

## 📱 PWA

KenFinance puede instalarse como Progressive Web App en navegadores compatibles.

Incluye:

```text
manifest.json
service-worker.js
icons/
```

El Service Worker mantiene en caché recursos principales de la interfaz.

> KenFinance v1.0 no debe considerarse una aplicación completamente offline-first. Las principales operaciones de escritura en Firebase requieren conectividad.

El manifest también incluye accesos rápidos para:

- Nuevo Ingreso.
- Nuevo Gasto.

---

## 🛠️ Tecnologías

### Frontend

- HTML5.
- CSS3.
- JavaScript ES Modules.

### Backend / BaaS

- Firebase Authentication.
- Cloud Firestore.

### Gráficos

- Chart.js.

### Exportación

- SheetJS.
- jsPDF.

### PWA

- Web App Manifest.
- Service Worker.

### Desarrollo

- Node.js.
- npm.
- ESLint.
- `serve`.

### Hosting

- **Vercel** — hosting principal.
- Firebase Hosting — alternativa configurada.
- Netlify — compatibilidad adicional mediante `_redirects`.

---

## 🏗️ Arquitectura

```text
KenFinance/
│
├── index.html
├── manifest.json
├── service-worker.js
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── vercel.json
├── package.json
├── DEPLOYMENT.md
├── GUIA_TECNICA_COMPLETA.md
├── CHANGELOG.md
│
├── css/
│   └── styles.css
│
├── icons/
│   └── ...
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

## 🧩 Módulos principales

### `js/app.js`

Orquestador principal.

Coordina:

- autenticación;
- perfil;
- cuentas;
- movimientos;
- filtros;
- dashboard;
- plan;
- exportaciones;
- tema;
- conectividad;
- Service Worker.

### `js/state.js`

Mantiene el estado compartido del frontend.

### `js/services/authService.js`

Abstrae Firebase Authentication.

### `js/services/dbService.js`

Centraliza el acceso a Cloud Firestore.

### `js/services/exportService.js`

Gestiona Excel y PDF.

### `js/ui/`

Agrupa responsabilidades de interfaz:

- gráficos;
- helpers;
- insights;
- modales;
- renderizado;
- toasts.

---

## 🗃️ Modelo de datos

Estructura principal:

```text
users/
└── {uid}
    └── assets/
        └── {assetId}

transactions/
└── {uid}
    ├── income/
    │   └── {transactionId}
    └── expenses/
        └── {transactionId}

plans/
└── {uid}
```

Los datos se relacionan con el usuario autenticado mediante su `uid`.

---

## 🚀 Desarrollo local

### Requisitos

- Git.
- Node.js.
- npm.
- Navegador moderno.

### Clonar repositorio

```bash
git clone https://github.com/KenLozano/KenFinance.git
cd KenFinance
```

> Si el repositorio es privado, GitHub solicitará autenticación.

### Instalar

```bash
npm install
```

### Ejecutar

```bash
npm run dev
```

El proyecto utiliza:

```text
npx -y serve .
```

### Lint

```bash
npm run lint
```

---

## 🔥 Configuración de Firebase

KenFinance utiliza:

```text
js/firebase/runtime-config.js
```

para proporcionar la configuración Firebase de la aplicación web.

La configuración debe corresponder al mismo proyecto utilizado para:

- Authentication;
- Firestore;
- reglas;
- índices.

Las reglas se encuentran en:

```text
firestore.rules
```

y los índices en:

```text
firestore.indexes.json
```

Para información completa de despliegue consulta:

**[DEPLOYMENT.md](DEPLOYMENT.md)**

---

## 🔒 Seguridad

KenFinance utiliza:

- Firebase Authentication;
- Firestore Security Rules;
- validaciones frontend;
- Content Security Policy;
- headers de seguridad;
- validación de montos y fechas;
- asociación de datos mediante usuario y cuenta.

> Las validaciones JavaScript no sustituyen las Firestore Security Rules. La autorización de acceso a datos debe controlarse desde Firebase.

---

## 📚 Documentación

| Documento | Descripción |
|---|---|
| [README.md](README.md) | Introducción general al proyecto |
| [GUIA_TECNICA_COMPLETA.md](GUIA_TECNICA_COMPLETA.md) | Arquitectura y funcionamiento técnico de v1.0 |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Configuración y proceso de despliegue |
| [CHANGELOG.md](CHANGELOG.md) | Historial de cambios y versiones |

---

## ⚠️ Limitaciones conocidas de v1.0

- No existe conversión automática entre monedas.
- No existe saldo consolidado multimoneda.
- No existe un movimiento específico para transferencias entre cuentas propias.
- No existe todavía un módulo completo de metas financieras.
- No existe un sistema completo de notificaciones financieras.
- No existe todavía un sistema completo de recomendaciones.
- No es una aplicación completamente offline-first.
- No existe una suite automatizada completa de pruebas.

---

## 🗺️ Próxima etapa

La siguiente etapa de KenFinance estará orientada a modernizar la experiencia y preparar el proyecto para crecer.

### Fase 2 — Rediseño y modernización del frontend

Objetivos previstos:

- nueva interfaz responsive;
- experiencia desktop más productiva;
- experiencia móvil optimizada;
- navegación por páginas;
- nuevo Home;
- Historial separado;
- Portafolio separado;
- vista de análisis gráfico;
- nuevo gráfico temporal;
- design system propio de KenFinance;
- migración progresiva hacia TypeScript;
- Angular;
- Ionic.

> Estos puntos forman parte del roadmap y **no están implementados en KenFinance v1.0**.

---

## 💡 Visión futura

KenFinance busca evolucionar gradualmente hacia una plataforma personal de gestión financiera.

Ideas previstas para etapas posteriores:

- transferencias entre cuentas;
- categorías más avanzadas;
- metas financieras;
- deudas;
- suscripciones;
- calendario financiero;
- activos con rendimiento;
- depósitos a plazo;
- multimoneda con tipos de cambio;
- saldo consolidado;
- inversiones;
- notificaciones;
- recomendaciones;
- análisis avanzado;
- automatizaciones;
- capacidades móviles mediante tecnologías híbridas.

Estas funcionalidades se desarrollarán progresivamente y no representan compromisos de versión específicos.

---

## 📦 Versión

Versión actual:

```text
1.0.0
```

La v1.0 representa el cierre funcional de la **Fase 1**.

Consulta el historial completo en:

**[CHANGELOG.md](CHANGELOG.md)**

---

## 📄 Licencia

El proyecto declara licencia:

```text
MIT
```

en `package.json`.

---

## 👨‍💻 Autor

**Ken Lozano**

GitHub: [@KenLozano](https://github.com/KenLozano)

---

<div align="center">

### KenFinance

**Organiza hoy. Entiende mañana. Decide mejor.**

</div>
