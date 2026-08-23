# Changelog

Todos los cambios relevantes de **KenFinance** se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto sigue [Semantic Versioning](https://semver.org/lang/es/).

---

## [Unreleased]

### Planned
- Rediseño completo de la interfaz para desktop y móvil.
- Migración progresiva del frontend hacia una arquitectura basada en TypeScript, Angular e Ionic.
- Nueva navegación por páginas: Inicio, Historial, Portafolio y Más.
- Vista de análisis gráfico separada del historial.
- Nuevo gráfico temporal de flujo financiero.
- Mejoras futuras de Portafolio, transferencias, notificaciones y recomendaciones.

> Estos elementos pertenecen a fases posteriores y todavía no forman parte de KenFinance v1.0.

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
```

---

## Historial de versiones

| Versión | Fecha | Estado | Descripción |
|---|---|---|---|
| 1.0.0 | 2026-08-22 | Preparada para release | Primera versión funcional consolidada y cierre de la Fase 1. |

---

**KenFinance v1.0 — Fase 1**
