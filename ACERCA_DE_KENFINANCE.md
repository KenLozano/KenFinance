# Acerca de KenFinance

**Versión actual:** KenFinance v2.0.0  
**Estado:** Estable  
**Fase:** 2 — Rediseño y modernización

---

## ¿Qué es KenFinance?

**KenFinance** es una aplicación de finanzas personales creada para ayudar a las personas a registrar, organizar y comprender mejor su información financiera cotidiana.

La aplicación permite centralizar en un solo lugar datos como:

- ingresos;
- gastos;
- cuentas;
- saldos;
- movimientos;
- información de perfil;
- planificación financiera;
- reportes.

KenFinance no administra dinero real ni se conecta actualmente a cuentas bancarias para mover fondos. Su función es servir como una herramienta de **seguimiento y organización financiera personal**.

---

## Propósito del proyecto

KenFinance nace con el objetivo de ofrecer una herramienta simple, flexible y ampliable para llevar un mejor control de las finanzas personales.

El proyecto busca resolver problemas comunes como:

- no saber cuánto dinero existe entre distintas cuentas;
- perder el control de pequeños gastos;
- registrar ingresos y gastos de forma desordenada;
- no tener una visión clara del balance de un período;
- depender de varias aplicaciones o notas separadas;
- no contar con reportes propios de la información financiera.

La idea central es que el usuario pueda construir una representación clara de su situación financiera a partir de los datos que registra.

---

## Filosofía de KenFinance

KenFinance se desarrolla siguiendo varios principios:

### Claridad

La información financiera debe presentarse de forma comprensible y útil.

### Control del usuario

El usuario decide qué información registra y cómo organiza sus cuentas y movimientos.

### No custodia

KenFinance no administra ni controla fondos reales.

### Privacidad

Los datos deben mantenerse asociados a cada usuario y protegidos mediante mecanismos de autenticación y autorización.

### Evolución incremental

El proyecto se desarrolla por versiones, incorporando nuevas funcionalidades de forma progresiva y procurando mantener estabilidad entre releases.

---

## Evolución del proyecto

### Fase 1 — KenFinance v1.0

La primera versión estable fue desarrollada principalmente con:

```text
HTML
CSS
JavaScript ES Modules
Firebase
```

Esta fase permitió consolidar funciones como:

- autenticación;
- cuentas;
- ingresos;
- gastos;
- saldos;
- filtros;
- gráficos;
- reportes;
- PWA.

---

### Fase 2 — KenFinance v2.0

La segunda fase representó una modernización completa del frontend.

La aplicación migró hacia:

```text
Angular 20
Ionic 9
TypeScript
Firebase Authentication
Cloud Firestore
```

Esta migración permitió mejorar:

- arquitectura;
- mantenibilidad;
- navegación;
- separación por módulos;
- experiencia responsive;
- escalabilidad futura.

KenFinance v2.0 incorpora una estructura basada en áreas como:

- Home;
- Historial;
- Portafolio;
- Perfil;
- Plan;
- Reportes.

---

## Funciones principales

KenFinance v2.0 permite trabajar con funcionalidades como:

### Autenticación

- inicio de sesión;
- cierre de sesión;
- persistencia de sesión;
- protección de rutas.

### Portafolio

- registro de cuentas;
- consulta de saldos;
- organización de distintas fuentes de dinero.

### Movimientos

- registro de ingresos;
- registro de gastos;
- asociación de movimientos a cuentas;
- historial financiero.

### Home

- balance del período;
- ingresos;
- gastos;
- patrimonio o saldo total;
- movimientos recientes;
- indicadores.

### Plan financiero

Permite utilizar objetivos y límites para comparar el comportamiento financiero real con la planificación personal.

### Reportes

Generación de:

- PDF;
- Excel.

---

## Tecnologías principales

KenFinance v2.0 utiliza actualmente:

```text
Angular 20
Ionic 9
TypeScript 5.9
RxJS
AngularFire
Firebase Authentication
Cloud Firestore
Angular Service Worker
Capacitor 8
jsPDF
SheetJS / XLSX
Vercel
```

---

## ¿KenFinance es una aplicación bancaria?

No.

KenFinance no es:

- banco;
- billetera digital;
- entidad financiera;
- broker;
- casa de cambio;
- custodio de dinero.

Los datos mostrados dentro de la aplicación representan información registrada por el usuario.

---

## ¿KenFinance ofrece asesoría financiera?

No.

Los cálculos, gráficos, reportes e indicadores disponibles tienen fines informativos y de organización personal.

KenFinance no reemplaza asesoría financiera, contable, tributaria, legal ni de inversión profesional.

---

## Privacidad y seguridad

KenFinance utiliza mecanismos como:

- Firebase Authentication;
- identificación mediante `uid`;
- Firestore Security Rules;
- HTTPS;
- protección de rutas.

La información de cada usuario se encuentra separada mediante reglas de acceso basadas en autenticación.

Para más información, consultar:

`POLITICA_DE_PRIVACIDAD.md`

---

## Código fuente y licencia

KenFinance es un proyecto de código fuente público.

El código se encuentra disponible en GitHub y utiliza la licencia:

```text
MIT License
```

La licencia completa puede consultarse en:

`LICENSE`

---

## Estado actual

```text
Proyecto: KenFinance
Versión: 2.0.0
Fase: 2
Estado: ESTABLE
QA: GO CON OBSERVACIÓN
Hosting: Vercel
Repositorio: GitHub
```

---

## Desarrollo futuro

KenFinance continuará evolucionando mediante versiones incrementales.

Entre las áreas previstas para futuras versiones se encuentran:

- transferencias entre cuentas;
- notificaciones;
- metas financieras;
- gestión de deudas;
- inversiones;
- mejoras de Portafolio;
- multimoneda avanzada;
- automatizaciones;
- recomendaciones financieras;
- mejoras de experiencia de usuario.

Las funcionalidades futuras solo deben considerarse disponibles cuando hayan sido implementadas y publicadas oficialmente.

---

## Documentación relacionada

La documentación principal del proyecto incluye:

- `README.md`;
- `GUIA_TECNICA_COMPLETA.md`;
- `DEPLOYMENT.md`;
- `CHANGELOG.md`;
- `INFORME_QA_V2.0.md`;
- `TERMINOS_Y_CONDICIONES.md`;
- `POLITICA_DE_PRIVACIDAD.md`;
- `FAQ.md`;
- `LICENSE`.

---

## Desarrollador

KenFinance es desarrollado como proyecto de software independiente por:

**Ken Lozano**

---

## Contacto

Para soporte, sugerencias, reportes de errores y consultas
sobre KenFinance:

**Telegram:** [@Ken_Lozano](https://t.me/Ken_Lozano)

Para más información, consulte `SOPORTE_Y_CONTACTO.md`.

---

**KenFinance**  
Una herramienta de organización y seguimiento de finanzas personales.
