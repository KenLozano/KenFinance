# Preguntas Frecuentes (FAQ) — KenFinance

**Última actualización:** 6 de septiembre de 2026  
**Versión aplicable:** KenFinance v2.0.0

---

## 1. ¿Qué es KenFinance?

KenFinance es una aplicación de finanzas personales diseñada para ayudar al usuario a registrar, organizar y consultar información relacionada con:

- ingresos;
- gastos;
- cuentas;
- saldos;
- movimientos;
- plan financiero;
- reportes.

La aplicación funciona como una herramienta de organización personal y no como una entidad financiera.

---

## 2. ¿KenFinance es un banco o una billetera digital?

No.

KenFinance no guarda dinero real, no recibe depósitos, no realiza transferencias bancarias y no administra fondos del usuario.

Las cuentas que aparecen dentro de la aplicación son representaciones de cuentas reales que el propio usuario registra manualmente.

---

## 3. ¿KenFinance mueve dinero entre mis cuentas reales?

No.

Registrar un ingreso, gasto o cuenta dentro de KenFinance solo modifica la información almacenada en la aplicación.

No genera movimientos reales en bancos, billeteras digitales, tarjetas ni otras plataformas externas.

---

## 4. ¿Necesito crear una cuenta para usar KenFinance?

Sí, las funciones principales requieren autenticación.

KenFinance utiliza **Firebase Authentication** para gestionar el inicio de sesión y la sesión del usuario.

---

## 5. ¿Puedo iniciar sesión con Google?

Sí, cuando esta opción se encuentra disponible en la versión desplegada.

KenFinance utiliza Google OAuth a través de Firebase Authentication.

---

## 6. ¿KenFinance guarda mi contraseña?

KenFinance no almacena la contraseña del usuario en Cloud Firestore como texto plano.

La gestión de credenciales se realiza mediante **Firebase Authentication**.

---

## 7. ¿Qué información puedo guardar en mi perfil?

Dependiendo de los campos disponibles en la versión actual, el perfil puede incluir información como:

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

Parte de esta información es opcional.

---

## 8. ¿Qué tipos de cuentas puedo registrar?

KenFinance permite trabajar con distintos tipos de cuentas financieras.

Entre los tipos contemplados se encuentran:

- cuenta bancaria;
- billetera digital;
- efectivo;
- tarjeta de crédito;
- criptomonedas.

---

## 9. ¿Qué monedas soporta KenFinance?

La versión actual contempla:

- PEN;
- USD;
- EUR.

KenFinance v2.0.0 no realiza una conversión automática completa entre monedas.

---

## 10. ¿Cómo se calcula el saldo de una cuenta?

El saldo se calcula a partir de los movimientos asociados a la cuenta.

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

Esto permite mantener relación entre el historial de movimientos y el saldo mostrado.

---

## 11. ¿El saldo inicial cuenta como ingreso?

No debe considerarse como un ingreso generado durante el período.

El saldo inicial representa dinero que ya existía en la cuenta antes de comenzar a registrarla en KenFinance.

---

## 12. ¿Puedo registrar ingresos y gastos?

Sí.

Cada movimiento puede asociarse a una cuenta y formar parte del historial y de los cálculos financieros.

---

## 13. ¿Puedo editar o eliminar movimientos?

Sí, siempre que la funcionalidad correspondiente esté disponible en la versión actual.

Cuando un movimiento cambia o se elimina, el saldo asociado debe actualizarse de forma coherente.

---

## 14. ¿KenFinance permite transferencias entre cuentas?

No en v2.0.0.

Las transferencias internas entre cuentas propias están previstas como una funcionalidad futura.

---

## 15. ¿Qué es Portafolio?

Portafolio es la sección donde el usuario puede consultar y gestionar sus cuentas financieras.

Actualmente se utiliza principalmente para organizar cuentas y saldos, pero está preparada para evolucionar en futuras versiones.

---

## 16. ¿Qué muestra el Home?

El Home funciona como resumen financiero principal.

Puede mostrar información como:

- balance del período;
- ingresos;
- gastos;
- saldo total o patrimonio;
- movimientos recientes;
- indicadores;
- accesos rápidos.

---

## 17. ¿Qué puedo ver en Historial?

La sección Historial permite consultar movimientos financieros de forma independiente al Home.

Su objetivo es facilitar la revisión de ingresos y gastos registrados.

---

## 18. ¿Qué es el Plan financiero?

El Plan financiero permite establecer referencias como:

- objetivo de ingresos;
- límite de gastos.

Estos valores pueden utilizarse para comparar el comportamiento financiero real con los objetivos configurados.

---

## 19. ¿KenFinance genera reportes?

Sí.

KenFinance puede generar reportes en:

- PDF;
- Excel.

Los reportes se construyen con la información registrada por el usuario.

---

## 20. ¿Los reportes de KenFinance son documentos oficiales?

No.

Los reportes son herramientas informativas y de organización personal.

No sustituyen:

- estados de cuenta bancarios;
- documentos contables;
- documentos tributarios;
- certificados oficiales.

---

## 21. ¿KenFinance da asesoría financiera?

No.

Los cálculos, gráficos, indicadores y reportes son informativos.

KenFinance no reemplaza asesoría financiera, contable, tributaria, legal ni de inversión profesional.

---

## 22. ¿Mis datos financieros son privados?

KenFinance utiliza Firebase Authentication y Firestore Security Rules para asociar los datos al usuario autenticado y restringir el acceso ordinario entre usuarios.

La seguridad completa también depende de la infraestructura y de las medidas adoptadas por el usuario para proteger su cuenta y dispositivo.

---

## 23. ¿Otro usuario puede ver mis datos?

Por diseño, no.

Las reglas de Firestore verifican que el usuario autenticado corresponda al propietario de la información consultada.

---

## 24. ¿El desarrollador puede acceder a mis datos?

El acceso normal desde la aplicación está restringido por usuario.

Sin embargo, las cuentas administrativas responsables de la infraestructura pueden disponer de capacidades técnicas de administración fuera del flujo normal de la aplicación cuando sea necesario para:

- mantenimiento;
- soporte;
- seguridad;
- diagnóstico.

---

## 25. ¿KenFinance usa Google Analytics?

KenFinance v2.0.0 no tiene actualmente una implementación de Google Analytics integrada en el código de la aplicación.

Si en una versión futura se incorpora analítica, deberá reflejarse en la Política de Privacidad.

---

## 26. ¿Dónde se almacenan mis datos?

KenFinance utiliza principalmente:

- **Firebase Authentication**, para identidad y sesión;
- **Cloud Firestore**, para datos del usuario;
- **Vercel**, para alojar la aplicación web.

---

## 27. ¿Qué pasa si desinstalo la PWA o borro la aplicación del dispositivo?

Desinstalar la PWA no elimina automáticamente los datos almacenados en Cloud Firestore.

La información remota continúa asociada a la cuenta del usuario.

---

## 28. ¿Puedo eliminar completamente mi cuenta y todos mis datos?

KenFinance v2.0.0 no dispone todavía de una función completa de autoservicio para eliminar automáticamente la cuenta y todos los datos relacionados.

Hasta que se implemente esta función, las solicitudes deberán gestionarse mediante el canal oficial de contacto del proyecto.



---

## 29. ¿Puedo usar KenFinance sin conexión a Internet?

KenFinance tiene capacidades PWA, pero v2.0.0 no debe considerarse una aplicación completamente offline-first.

Las operaciones que dependen de Firebase requieren conectividad.

---

## 30. ¿Puedo instalar KenFinance en mi celular o computadora?

Sí, cuando el navegador y el dispositivo sean compatibles con PWA.

La opción puede aparecer como:

- Instalar aplicación;
- Agregar a pantalla principal;
- Instalar KenFinance.

El texto depende del navegador.

---

## 31. ¿KenFinance funciona igual en móvil y escritorio?

No necesariamente.

La interfaz está diseñada para adaptarse al dispositivo.

Desktop y móvil pueden utilizar distribuciones diferentes para aprovechar mejor el espacio disponible.

---

## 32. ¿KenFinance es de código abierto?

El código fuente del proyecto se publica bajo la licencia indicada en el archivo `LICENSE`.

Actualmente KenFinance utiliza la **MIT License**.

---

## 33. ¿Puedo modificar o reutilizar el código?

El uso y reutilización del código se rige por la licencia MIT incluida en el repositorio.

Las dependencias externas mantienen sus propias licencias.

---

## 34. ¿Qué versión está actualmente estable?

La versión estable documentada es:

```text
KenFinance v2.0.0
```

Corresponde al cierre de la Fase 2.

---

## 35. ¿Qué funcionalidades todavía no están disponibles?

Entre las funcionalidades previstas para versiones futuras se encuentran:

- transferencias entre cuentas;
- notificaciones financieras;
- metas avanzadas;
- gestión completa de deudas;
- inversiones;
- automatizaciones;
- recomendaciones financieras;
- mejoras de multimoneda;
- nuevas funciones de Portafolio.

---

## 36. ¿Dónde puedo ver los cambios de cada versión?

El historial se encuentra en:

`CHANGELOG.md`

del repositorio oficial de KenFinance.

---

## 37. ¿Dónde puedo consultar la documentación técnica?

El repositorio contiene documentación como:

- `README.md`;
- `GUIA_TECNICA_COMPLETA.md`;
- `DEPLOYMENT.md`;
- `CHANGELOG.md`;
- `INFORME_QA_V2.0.md`;
- `TERMINOS_Y_CONDICIONES.md`;
- `POLITICA_DE_PRIVACIDAD.md`.

---

## 38. ¿Cómo puedo reportar un error o problema?

Debe utilizarse el canal oficial de soporte del proyecto.


---

## 39. ¿Cómo puedo hacer una consulta sobre privacidad?

Las consultas relacionadas con privacidad, acceso o eliminación de datos deben realizarse mediante el canal oficial correspondiente.

---

### ¿Cómo puedo contactar al desarrollador?

Actualmente puedes contactar al desarrollador mediante Telegram:

[@Ken_Lozano](https://t.me/Ken_Lozano)

Este canal sirve para reportar errores, enviar sugerencias,
consultar sobre el funcionamiento de la aplicación y realizar
consultas relacionadas con privacidad.

---

## 40. ¿KenFinance seguirá recibiendo actualizaciones?

Sí.

KenFinance se desarrolla de forma incremental y nuevas funcionalidades o correcciones pueden publicarse en versiones posteriores.

Las funcionalidades futuras solo deben considerarse disponibles cuando hayan sido implementadas y publicadas oficialmente.

---

**KenFinance v2.0.0**  
Proyecto de software independiente.
