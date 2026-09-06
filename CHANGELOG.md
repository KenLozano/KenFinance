# Changelog

Todos los cambios relevantes de **KenFinance** se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto sigue [Semantic Versioning](https://semver.org/lang/es/).

---

## [Unreleased]

### Planned
- Corrección del espacio vertical excesivo al final de determinadas vistas.
- Mejoras del header en escritorio.
- Accesos rápidos al perfil.
- Sistema de notificaciones.
- Evolución del módulo Portafolio.
- Transferencias entre cuentas propias.
- Categorías financieras más avanzadas.
- Metas financieras.
- Calendario financiero.
- Suscripciones.
- Gestión de deudas.
- Inversiones.
- Multimoneda avanzada y consolidación.
- Análisis financiero avanzado.
- Automatizaciones y recomendaciones.

> Estos elementos pertenecen a versiones posteriores y no forman parte de KenFinance v2.0.0.

---

## [2.0.0] - 2026-09-05

Segunda versión estable de KenFinance y cierre de la **Fase 2 — Rediseño y modernización**.

Esta versión representa la migración completa del frontend de KenFinance desde una arquitectura basada en HTML, CSS y JavaScript modular hacia **Angular 20 + Ionic 9 + TypeScript**, manteniendo Firebase Authentication y Cloud Firestore como servicios principales de backend.

### Added

#### Arquitectura y frontend
- Migración del frontend a **Angular 20.3.29**.
- Integración de **Ionic 9**.
- Adopción de **TypeScript 5.9.3**.
- Uso de **RxJS 7.8.x**.
- Integración de **AngularFire 20.0.1**.
- Incorporación de **Angular Router** para navegación por páginas.
- Organización modular del proyecto mediante `core/` y `features/`.
- Incorporación de una arquitectura preparada para mantenimiento y crecimiento incremental.
- Integración de **Capacitor 8** y plugins relacionados con App, Haptics, Keyboard y Status Bar.
- Integración de **Ionicons 8.1.x**.

#### Navegación y estructura funcional
- Nueva navegación por páginas.
- Home independiente.
- Historial independiente.
- Portafolio independiente.
- Flujo de autenticación separado del resto de funcionalidades.
- Protección de rutas para impedir acceso a vistas privadas sin sesión válida.
- Persistencia de sesión mediante Firebase Authentication.

#### Home
- Rediseño completo del dashboard principal.
- Balance del período como elemento principal.
- Visualización de ingresos.
- Visualización de gastos.
- Visualización de patrimonio o saldo total.
- Acceso a movimientos recientes.
- Acceso rápido al registro de movimientos.
- Integración de información proveniente de cuentas, movimientos e indicadores.

#### Historial
- Separación del historial respecto al Home.
- Consulta independiente de movimientos financieros.
- Conservación de filtros y análisis de movimientos dentro de una vista dedicada.

#### Portafolio
- Creación de un módulo independiente para la gestión de cuentas.
- Visualización organizada de cuentas financieras.
- Integración de saldos asociados a cuentas.
- Preparación de la arquitectura para futuras transferencias internas y ampliación del Portafolio.

#### Perfil y configuración
- Conservación y adaptación del perfil de usuario dentro de la nueva arquitectura.
- Integración del perfil con la navegación v2.
- Preparación de información de usuario para personalización de reportes.

#### Plan financiero
- Conservación del módulo de planificación financiera dentro de la nueva interfaz.
- Integración del plan con el flujo de navegación de la v2.

#### Reportes
- Conservación de exportación a PDF.
- Conservación de exportación a Excel.
- Uso de **jsPDF 4.2.1**.
- Uso de **SheetJS / XLSX 0.20.3**.
- Adaptación de reportes al nuevo frontend.
- Uso de información de perfil y movimientos dentro de los reportes.

#### PWA
- Integración de **Angular Service Worker 20.3.29**.
- Conservación de capacidades PWA.
- Instalación desde navegadores compatibles.
- Preparación del proyecto para experiencia web instalable.

#### Desarrollo y calidad
- Incorporación de **Angular CLI 20.3.34**.
- Configuración de **ESLint 9.16** y Angular ESLint.
- Incorporación de **Vitest 3.2.7**.
- Incorporación de **jsdom 26**.
- Scripts npm para:
  - desarrollo;
  - build;
  - watch;
  - test;
  - lint.
- Validación de build de producción mediante `npm run build`.
- Integración de flujo de trabajo mediante ramas, Pull Request, Preview y Production.

### Changed

#### Arquitectura
- El frontend dejó de utilizar la arquitectura principal basada en:
  - `index.html`;
  - `js/app.js`;
  - `js/state.js`;
  - módulos JavaScript manuales.
- La lógica pasó a organizarse mediante componentes, páginas, servicios y routing propios de Angular.
- La aplicación dejó de depender de una vista principal única y pasó a utilizar navegación modular.
- El Historial dejó de estar integrado dentro del Home y pasó a ser una sección independiente.
- La gestión de cuentas pasó a presentarse como **Portafolio**.
- La autenticación pasó a integrarse mediante servicios Angular y rutas protegidas.
- El proyecto dejó de utilizar `npm run dev` como comando principal de desarrollo.
- El script oficial de desarrollo pasó a ser:
  - `npm start` → `ng serve`.
- El proceso de producción pasó a requerir compilación mediante:
  - `npm run build`;
  - salida generada en `www/`.

#### UI / UX
- Rediseño completo de la interfaz.
- Nueva experiencia responsive.
- Adaptación diferenciada para desktop y móvil.
- Navegación inferior optimizada para móvil.
- Mayor separación visual y funcional entre módulos.
- Renovación de Home, Historial y Portafolio.

#### Deployment
- `main` quedó establecida como rama de producción.
- Vercel quedó conectado al flujo de producción de v2.0.
- Se utilizó `v2-development` como rama de desarrollo durante el cierre.
- Se incorporó flujo de Pull Request para integración controlada.
- Se utilizaron Preview Deployments para validación previa.
- Se descartó reutilizar automáticamente el `vercel.json` heredado de v1.0.
- La configuración de deployment pasó a documentarse específicamente para Angular/Ionic.

#### Documentación
- README actualizado para reflejar v2.0.
- Guía Técnica actualizada para Angular/Ionic/TypeScript.
- Deployment actualizado para el flujo real de v2.0.
- `package.json` actualizado con:
  - versión `2.0.0`;
  - autor `Ken Lozano`;
  - homepage del repositorio;
  - descripción real del proyecto.

### Fixed

- Corregidos problemas encontrados durante la migración inicial de rutas.
- Corregida una estructura duplicada `app/app` generada durante la creación del proyecto.
- Corregidos problemas iniciales de carga de autenticación.
- Corregida pantalla en blanco observada durante el arranque de Auth.
- Corregidos errores relacionados con la creación inicial de módulos y rutas.
- Corregida la configuración inicial incompleta de AngularFire para incluir Firestore.
- Corregidos conflictos de integración entre `main` y `v2-development`.
- Resuelto el conflicto de merge relacionado con `vercel.json`.
- Validado el comportamiento de login, logout, navegación, rutas protegidas, Home, Historial, Portafolio, Perfil, Plan y Reportes en producción.

### Removed

- Eliminada la arquitectura frontend principal de v1.0 basada en JavaScript Vanilla como base activa de la aplicación.
- Eliminado `vercel.json` heredado de v1.0 de la arquitectura actual.
- Retirada la dependencia operativa del Service Worker manual de v1.0.
- Retirada la navegación principal concentrada en una única vista.
- Retiradas configuraciones de despliegue históricas no confirmadas como parte de v2.0.

### Security

- Firebase Authentication continúa como mecanismo principal de identidad.
- Se incorporó protección de rutas en Angular.
- Firestore Security Rules continúan siendo la capa principal de autorización de datos.
- Se mantuvo el principio de aislamiento de datos mediante el `uid` del usuario autenticado.
- Se validó que el usuario no pueda recuperar acceso funcional a rutas protegidas tras cerrar sesión simplemente usando la navegación "Atrás".
- Se revisó el comportamiento general de autenticación y acceso durante QA.
- Se mantuvo la recomendación de no almacenar secretos, contraseñas, tokens privados ni credenciales administrativas en el repositorio.

### QA

Antes del release se realizaron pruebas en:

```text
Local
Vercel Preview
Vercel Production
```

Se validaron:

- build de producción;
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
- comportamiento responsive;
- producción en Vercel;
- comportamiento general de la PWA.

Resultado:

```text
GO con observación
```

No se identificaron hallazgos **P0** o **P1** que bloquearan el release.

### Known limitations

- Existe un espacio vertical excesivo después del contenido en determinadas vistas.
  - Severidad QA: `P2`.
  - Impacto funcional: ninguno.
  - No bloquea v2.0.0.
- El build puede mostrar warnings no bloqueantes relacionados con:
  - budgets SCSS;
  - dependencias CommonJS utilizadas indirectamente por librerías de reportes.
- No existe todavía un movimiento específico para transferencias entre cuentas propias.
- No existe todavía un sistema completo de notificaciones financieras.
- No existe todavía un módulo completo de metas financieras avanzadas.
- No existe todavía una gestión completa de deudas.
- No existe todavía un módulo de inversiones.
- No existe todavía un sistema completo de automatizaciones financieras.
- No existe todavía un sistema completo de recomendaciones financieras.
- KenFinance v2.0 no debe considerarse una aplicación completamente offline-first.

---

## [1.0.0] - 2026-08-22

Primera versión funcional consolidada de KenFinance y cierre de la **Fase 1**.

### Added

#### Autenticación y usuario
- Registro mediante correo electrónico y contraseña.
- Inicio de sesión mediante correo electrónico y contraseña.
- Inicio de sesión con Google.
- Cierre de sesión.
- Recuperación de contraseña.
- Perfil de usuario.
- Datos adicionales de perfil:
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
- Cálculo de completitud del perfil.

#### Cuentas y activos
- Gestión de cuentas financieras mediante `assets`.
- Tipos de cuenta:
  - cuenta bancaria;
  - billetera digital;
  - efectivo;
  - tarjeta de crédito;
  - criptomonedas.
- Soporte de monedas:
  - PEN;
  - USD;
  - EUR.
- Creación de cuentas.
- Edición de cuentas.
- Archivado lógico de cuentas.
- Restricción para evitar archivar cuentas con saldo distinto de cero.
- Asociación de movimientos a una cuenta real mediante `assetId`.
- Cálculo dinámico del saldo de cada cuenta a partir de sus movimientos.
- Visualización de saldos agrupados por moneda.
- Registro de saldo inicial como movimiento especial.
- Exclusión del saldo inicial de los ingresos reales del dashboard y los reportes.

#### Movimientos
- Registro de ingresos.
- Registro de gastos.
- Edición de movimientos.
- Eliminación de movimientos.
- Notas de texto libre.
- Etiquetas opcionales en ingresos.
- Fuente de ingreso.
- Categorías de gasto:
  - Fijo;
  - Necesario;
  - Antojo.
- Métodos de pago.
- Prioridad de gastos.
- Comercio o proveedor opcional.

#### Filtros y búsqueda
- Filtro por Hoy.
- Filtro por últimos 7 días.
- Filtro por Mes.
- Rango personalizado de fechas.
- Búsqueda de movimientos por nota y monto.
- Filtro por categoría.
- Ordenamiento por:
  - fecha descendente;
  - fecha ascendente;
  - mayor monto;
  - menor monto.
- Persistencia local de determinadas preferencias de filtros y ordenamiento.

#### Dashboard y análisis
- Balance calculado según ingresos y gastos del período.
- Totales de ingresos y gastos.
- Gráfico de Ingresos vs Gastos.
- Gráfico de distribución de gastos por categoría.
- Indicadores financieros.
- Tasa de ahorro.
- Runway estimado.
- Categoría dominante.
- Burn diario.
- Panel estratégico.
- Plan financiero.
- Objetivo de ingresos.
- Límite de gastos.
- Indicadores relacionados con el plan mensual.

#### Reportes
- Exportación a Excel mediante SheetJS.
- Exportación a PDF mediante jsPDF.
- Reportes semanales.
- Reportes mensuales.
- Hojas Excel:
  - Resumen;
  - Ingresos;
  - Gastos;
  - Analisis.
- Inclusión de información del usuario en los reportes.
- Exclusión del saldo inicial de los ingresos reales exportados.
- Paginación de movimientos en PDF.
- Carga diferida de las librerías de exportación.

#### Interfaz y experiencia
- Tema claro.
- Tema oscuro.
- Detección de preferencia de tema del sistema.
- Persistencia de la preferencia de tema.
- Modales reutilizables.
- Toasts para mensajes de éxito, error, advertencia e información.
- Renderizado modular de movimientos.
- Diseño responsive para web y móvil.

#### PWA
- `manifest.json`.
- `service-worker.js`.
- Iconos PWA en múltiples resoluciones.
- Instalación como Progressive Web App en navegadores compatibles.
- Estrategia de caché para recursos principales.
- Tratamiento especial del Service Worker durante desarrollo local.
- Detección de actualizaciones del Service Worker.
- Accesos rápidos del manifest para nuevo ingreso y nuevo gasto.

#### Conectividad
- Detección de estado online/offline.
- Bloqueo preventivo de operaciones principales de cuentas y movimientos cuando no existe conexión.

#### Arquitectura y desarrollo
- Separación del JavaScript en ES Modules.
- Estado central mediante `js/state.js`.
- Servicio de autenticación mediante `authService.js`.
- Servicio de base de datos mediante `dbService.js`.
- Servicio de exportaciones mediante `exportService.js`.
- Separación de utilidades de interfaz:
  - `charts.js`;
  - `helpers.js`;
  - `insights.js`;
  - `modals.js`;
  - `render.js`;
  - `toast.js`.
- Configuración de ESLint.
- Scripts npm para desarrollo local y lint.
- Configuración para Vercel.
- Configuración alternativa para Firebase Hosting.
- Configuración de Firestore Rules e índices.
- Encabezados de seguridad y Content Security Policy.

### Changed
- Los ingresos y gastos dejaron de depender de cuentas fijas y pasaron a vincularse a cuentas reales mediante `assetId`.
- El saldo de una cuenta pasó a calcularse desde su historial de movimientos en lugar de mantenerse como un valor independiente.
- El saldo inicial pasó a registrarse como un movimiento especial para mantener consistencia con el historial.
- Las cuentas pasaron a utilizar archivado lógico para preservar referencias históricas.
- El proyecto evolucionó de una estructura más concentrada hacia una arquitectura JavaScript modular.
- Los reportes se actualizaron para trabajar con la estructura actual de movimientos y excluir correctamente saldos iniciales.
- Vercel quedó definido como hosting principal de la versión 1.0.
- La documentación técnica y de despliegue fue actualizada para reflejar la arquitectura real de la Fase 1.

### Fixed
- Corregido el flujo de eliminación/archivado de cuentas para evitar confirmaciones duplicadas.
- Corregidas inconsistencias relacionadas con movimientos sin una cuenta asociada.
- Corregidos problemas de saldo provocados por funcionalidades que podían crear movimientos sin `assetId`.
- Mejorada la validación de cuentas antes de ejecutar operaciones relacionadas con movimientos.
- Mejorada la consistencia entre saldo inicial, saldo de cuenta y totales financieros.

### Removed
- Eliminada completamente la función **“Duplicar último gasto”**.
- Eliminadas sus referencias en estado, lógica, servicio de base de datos, interfaz y estilos.
- Eliminado el botón asociado a dicha funcionalidad.
- Eliminadas referencias obsoletas relacionadas con la duplicación de movimientos.

### Security
- Uso de Firebase Authentication para gestión de identidad.
- Uso de Firestore Security Rules para autorización de datos.
- Content Security Policy configurada para limitar orígenes permitidos.
- Encabezados de seguridad configurados para Vercel y Firebase Hosting.
- Validación frontend de montos, fechas, cuentas y longitudes de texto.

### Known limitations
- No existe conversión automática entre PEN, USD y EUR.
- No existe todavía un saldo consolidado multimoneda.
- No existe un modelo específico para transferencias entre cuentas propias.
- No existe todavía un módulo completo de metas financieras en la interfaz.
- No existe un sistema completo de notificaciones financieras.
- No existe todavía un sistema completo de recomendaciones.
- KenFinance v1.0 no es una aplicación completamente offline-first.
- No existe una suite automatizada completa de pruebas.

---

## Convenciones

Las futuras versiones utilizarán categorías como:

- `Added` — funcionalidades nuevas.
- `Changed` — cambios en funcionalidades existentes.
- `Deprecated` — funcionalidades que se retirarán próximamente.
- `Removed` — funcionalidades eliminadas.
- `Fixed` — correcciones de errores.
- `Security` — cambios relacionados con seguridad.

Las versiones seguirán el formato:

```text
MAJOR.MINOR.PATCH
```

Ejemplo:

```text
1.0.0
1.1.0
1.1.1
2.0.0
2.0.1
2.1.0
```

---

## Historial de versiones

| Versión | Fecha | Estado | Descripción |
|---|---|---|---|
| 2.0.0 | 2026-09-05 | Estable | Migración a Angular + Ionic + TypeScript y cierre de la Fase 2. |
| 1.0.0 | 2026-08-22 | Estable | Primera versión funcional consolidada y cierre de la Fase 1. |

---

**KenFinance v2.0 — Fase 2 finalizada**
