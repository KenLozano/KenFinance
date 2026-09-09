# Política de Privacidad — KenFinance

**Última actualización:** 6 de septiembre de 2026  
**Versión aplicable:** KenFinance v2.0.0

---

## 1. Introducción y alcance

Esta Política de Privacidad explica cómo **KenFinance** trata la información de los usuarios que utilizan la aplicación.

KenFinance es una aplicación de finanzas personales desarrollada como proyecto de software independiente. Su objetivo es permitir al usuario registrar, organizar y consultar información relacionada con sus finanzas personales.

Esta política se aplica al uso de KenFinance v2.0.0 y a los datos tratados a través de la aplicación.

---

## 2. Información que recopilamos

KenFinance trata únicamente la información necesaria para prestar las funcionalidades disponibles en la aplicación.

### 2.1 Datos de registro y autenticación

Para crear o utilizar una cuenta pueden tratarse datos como:

- correo electrónico;
- nombre asociado a la cuenta, cuando corresponda;
- identificador único de usuario generado por Firebase Authentication;
- datos necesarios para inicio de sesión mediante Google, cuando el usuario utilice Google OAuth.

Las contraseñas son gestionadas por **Firebase Authentication**.

KenFinance no almacena las contraseñas del usuario en Cloud Firestore como texto plano ni dispone de ellas directamente.

---

### 2.2 Datos de perfil

El usuario puede proporcionar información adicional desde su perfil, como:

- nombre;
- teléfono;
- fecha de nacimiento;
- ciudad;
- país;
- ocupación;
- moneda base;
- objetivo mensual;
- biografía;
- correo alternativo o de recuperación;
- contacto de emergencia.

Algunos de estos campos son opcionales y dependen de la información que el usuario decida registrar.

---

### 2.3 Datos financieros

KenFinance permite registrar información financiera proporcionada por el propio usuario.

Esta información puede incluir:

- cuentas financieras;
- nombre de la cuenta;
- tipo de cuenta;
- moneda;
- saldo inicial;
- ingresos;
- gastos;
- monto;
- fecha;
- cuenta asociada;
- categoría;
- método de pago;
- prioridad;
- comercio o proveedor;
- notas;
- etiquetas;
- objetivos o planes financieros;
- límites de gasto;
- metas de ingresos;
- información utilizada para calcular saldos, balances e indicadores.

KenFinance no obtiene automáticamente estos datos desde bancos u otras entidades financieras en v2.0.0.

Los datos financieros son registrados directamente por el usuario.

---

### 2.4 Datos técnicos y analítica

KenFinance v2.0.0 **no tiene integrada actualmente una implementación de Google Analytics en el código de la aplicación**.

Por tanto, KenFinance no utiliza Google Analytics como mecanismo propio de seguimiento de comportamiento en esta versión.

No obstante, los proveedores de infraestructura utilizados por la aplicación, como Firebase, Google Cloud o Vercel, pueden procesar determinados datos técnicos necesarios para prestar sus servicios, de acuerdo con sus propias políticas y configuraciones.

Estos datos técnicos pueden incluir información necesaria para:

- autenticación;
- entrega de contenido;
- seguridad;
- funcionamiento de infraestructura;
- diagnóstico técnico.

KenFinance no utiliza actualmente estos datos para crear perfiles publicitarios propios.

---

## 3. Cómo utilizamos la información

La información se utiliza para permitir el funcionamiento de KenFinance.

En particular, puede utilizarse para:

- autenticar al usuario;
- mantener su sesión;
- mostrar su perfil;
- guardar sus cuentas;
- registrar ingresos y gastos;
- calcular saldos;
- generar balances e indicadores;
- mostrar historial de movimientos;
- gestionar planes financieros;
- generar reportes PDF y Excel;
- mantener la seguridad de la aplicación;
- detectar y corregir problemas técnicos.

KenFinance no vende información personal ni financiera de los usuarios.

---

## 4. Dónde se almacena la información

KenFinance utiliza servicios de terceros para autenticación, almacenamiento y hosting.

### 4.1 Firebase Authentication

Se utiliza para:

- registro;
- inicio de sesión;
- gestión de sesión;
- autenticación mediante Google cuando corresponda.

Firebase Authentication gestiona las credenciales del usuario.

---

### 4.2 Cloud Firestore

Los datos de perfil y financieros se almacenan en **Cloud Firestore**.

La información se asocia al identificador único del usuario autenticado (`uid`).

Entre los datos almacenados pueden encontrarse:

- perfil;
- cuentas;
- ingresos;
- gastos;
- planes;
- metas;
- otros datos relacionados con las funcionalidades disponibles.

---

### 4.3 Vercel

Vercel se utiliza como plataforma principal de alojamiento de la aplicación web.

Vercel sirve el frontend de KenFinance y puede procesar información técnica necesaria para entregar el servicio de acuerdo con sus propias condiciones y políticas.

---

## 5. Acceso a los datos

### 5.1 Acceso desde la aplicación

KenFinance utiliza Firebase Authentication y Firestore Security Rules para separar la información de cada usuario.

Las reglas vigentes requieren autenticación y verifican que el identificador del usuario autenticado corresponda al propietario de los datos consultados.

Por diseño, un usuario normal no debe poder leer o modificar la información de otro usuario desde la aplicación.

---

### 5.2 Acceso administrativo

Las reglas de seguridad del cliente no deben interpretarse como una imposibilidad absoluta de acceso administrativo a la infraestructura.

Las cuentas con permisos administrativos sobre Firebase, Google Cloud o servicios relacionados pueden disponer de capacidades técnicas de administración fuera del flujo normal de la aplicación.

Cualquier acceso administrativo debe limitarse a situaciones justificadas, como:

- mantenimiento;
- soporte;
- seguridad;
- diagnóstico;
- cumplimiento de obligaciones aplicables.

---

### 5.3 Proveedores de servicios

KenFinance depende de proveedores tecnológicos que pueden procesar información como parte de la prestación de sus servicios.

Entre ellos se encuentran:

- Google Firebase;
- Google Cloud;
- Vercel.

Cada proveedor opera bajo sus propios términos y políticas de privacidad.

---

## 6. Reportes y exportaciones

KenFinance permite generar reportes mediante:

- PDF, utilizando jsPDF;
- Excel, utilizando SheetJS/XLSX.

Los reportes se generan a partir de la información del usuario disponible en la aplicación.

El usuario es responsable de:

- guardar estos archivos de forma segura;
- controlar con quién los comparte;
- eliminar copias que ya no necesite.

Una vez descargado un archivo al dispositivo del usuario, KenFinance no controla el uso posterior de esa copia local.

---

## 7. Retención de datos

Los datos pueden conservarse mientras sean necesarios para prestar el servicio y mientras permanezcan almacenados en la cuenta asociada.

Eliminar la PWA, cerrar el navegador o desinstalar KenFinance de un dispositivo **no elimina automáticamente los datos almacenados en Cloud Firestore**.

KenFinance v2.0.0 no dispone actualmente de una función completa de autoservicio que elimine automáticamente:

- la cuenta de autenticación;
- el perfil;
- todas las cuentas;
- todos los movimientos;
- todos los datos asociados.

Mientras no exista esta funcionalidad, las solicitudes de eliminación deberán gestionarse mediante el canal oficial de contacto del proyecto.

> **Pendiente antes de publicación pública:** definir un canal oficial para solicitudes de privacidad y eliminación de datos.

---

## 8. Derechos y control del usuario

El usuario puede gestionar parte de su información directamente desde las funcionalidades disponibles en KenFinance.

Dependiendo de la funcionalidad implementada, puede:

- consultar sus datos;
- actualizar información de perfil;
- modificar determinados registros;
- eliminar determinados movimientos o cuentas cuando la aplicación lo permita;
- exportar información mediante reportes.

Para solicitudes relacionadas con:

- acceso;
- rectificación;
- eliminación;
- privacidad;
- tratamiento de datos;

deberá utilizarse el canal oficial de contacto del proyecto.



---

## 9. Seguridad

KenFinance aplica medidas técnicas orientadas a proteger la información.

Entre ellas:

- Firebase Authentication;
- separación de datos mediante `uid`;
- Firestore Security Rules;
- protección de rutas;
- HTTPS en producción;
- validaciones de datos;
- restricciones de acceso por usuario.

Sin embargo, ningún sistema informático puede garantizar seguridad absoluta.

El usuario también debe proteger:

- su correo;
- sus credenciales;
- sus dispositivos;
- las copias de reportes que descargue.

---

## 10. Datos de terceros introducidos por el usuario

KenFinance permite registrar campos como un contacto de emergencia u otra información de texto proporcionada por el usuario.

El usuario debe evitar introducir información personal de terceros que no sea necesaria para utilizar la aplicación.

Cuando registre datos de otra persona, el usuario es responsable de hacerlo de forma legítima y adecuada.

---

## 11. Menores de edad

KenFinance no está diseñado específicamente como un servicio dirigido a menores de edad.

Si en el futuro el proyecto establece requisitos de edad específicos o mecanismos adicionales de consentimiento, esta política deberá actualizarse para reflejarlos.

---

## 12. Transferencias internacionales y proveedores

Debido al uso de servicios tecnológicos globales como Firebase, Google Cloud y Vercel, la información puede ser procesada en infraestructura ubicada fuera del país de residencia del usuario.

El tratamiento realizado por estos proveedores está sujeto a sus propias políticas, contratos y medidas de seguridad.

---

## 13. Cambios en esta Política de Privacidad

Esta política puede actualizarse cuando:

- cambien las funcionalidades;
- se incorporen nuevos proveedores;
- se modifiquen las prácticas de tratamiento de datos;
- se implemente analítica;
- se habilite eliminación completa de cuenta;
- cambien las medidas de seguridad.

La fecha de última actualización se mostrará al inicio del documento.

Cuando existan cambios importantes, se procurará comunicarlos de forma razonable dentro de la aplicación o mediante los canales oficiales del proyecto.

---

## 14. Contacto

Para consultas relacionadas con:

- privacidad;
- tratamiento de datos;
- acceso;
- rectificación;
- eliminación;
- seguridad;

debe utilizarse el canal oficial de contacto de KenFinance.

## Contacto

Para consultas relacionadas con privacidad, tratamiento de datos
o solicitudes relacionadas con los datos personales:

**Telegram:** [@Ken_Lozano](https://t.me/Ken_Lozano)

---

## 15. Relación con los Términos y Condiciones

Esta Política de Privacidad complementa los **Términos y Condiciones de Uso de KenFinance**.

Ambos documentos deben interpretarse conjuntamente en lo relacionado con el uso de la aplicación y el tratamiento de información.

---

**KenFinance v2.0.0**  
Proyecto de software independiente.
