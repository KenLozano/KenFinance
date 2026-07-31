# 🚀 Guía de Despliegue - Mi Dinero

Esta guía te ayudará a desplegar **Mi Dinero** en producción en minutos.

---

## 📋 Pre-requisitos

Antes de desplegar, asegúrate de tener:

- ✅ Proyecto Firebase configurado
- ✅ Authentication habilitado (Email/Password)
- ✅ Firestore Database creado
- ✅ Reglas de Firestore publicadas
- ✅ Código probado localmente

---

## 🌐 Opción 1: Netlify (Recomendado)

### ⚡ Deploy Rápido (5 minutos)

#### Método Drag & Drop

1. **Crear cuenta en Netlify**
   - Ir a [netlify.com](https://www.netlify.com)
   - Sign up (gratis, sin tarjeta de crédito)

2. **Deploy manual**
   ```
   - Ir al dashboard de Netlify
   - Click en "Sites" → "Add new site" → "Deploy manually"
   - Arrastrar carpeta `cont/` completa
   - Esperar ~30 segundos
   ```

3. **Obtener URL**
   - Netlify asigna URL automática: `https://random-name-123.netlify.app`
   - (Opcional) Cambiar nombre: Site settings → Change site name

4. **Configurar Firebase**
   ```
   1. Ir a Firebase Console → Authentication → Settings
   2. En "Authorized domains", agregar:
      - tu-sitio.netlify.app
   3. Click "Add domain"
   ```

5. **¡Listo!** 🎉
   - Tu app está en línea
   - HTTPS automático
   - CDN global
   - SSL certificado

#### Método CI/CD desde Git (Automático)

1. **Subir código a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Deploy Mi Dinero"
   git branch -M main
   git remote add origin https://github.com/tuusuario/mi-dinero.git
   git push -u origin main
   ```

2. **Conectar con Netlify**
   ```
   - Netlify Dashboard → "Add new site" → "Import from Git"
   - Autorizar GitHub
   - Seleccionar repositorio "mi-dinero"
   - Build settings (dejar vacío, es solo HTML)
   - Click "Deploy site"
   ```

3. **Deploy Automático**
   - Cada `git push` = deploy automático
   - Netlify construye y despliega en ~30 seg

### 📝 Archivo `_redirects` (Ya incluido)

Este archivo es crucial para SPAs en Netlify:

```
/*    /index.html   200
```

**¿Qué hace?**
- Redirige todas las rutas a `index.html`
- Permite navegación cliente-side
- Evita errores 404 al recargar página

### 🔧 Netlify.toml (Opcional)

Para configuración avanzada, crear `netlify.toml`:

```toml
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    
[[headers]]
  for = "/service-worker.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

---

## 🔥 Opción 2: Firebase Hosting

### Ventajas
- Integrado con Firebase
- CDN global
- HTTPS automático
- Comandos CLI simples

### Pasos

1. **Instalar Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login a Firebase**
   ```bash
   firebase login
   ```

3. **Inicializar proyecto**
   ```bash
   cd cont
   firebase init hosting
   ```

   Responder:
   - **Public directory**: `.` (punto)
   - **Configure as SPA**: **Yes**
   - **Overwrite index.html**: **No**

4. **Deploy**
   ```bash
   firebase deploy --only hosting
   ```

5. **URL resultante**
   - `https://tu-proyecto.web.app`
   - `https://tu-proyecto.firebaseapp.com`

6. **Dominio personalizado (Opcional)**
   ```bash
   firebase hosting:channel:deploy production
   ```

### firebase.json Actual

```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## ▲ Opción 3: Vercel

### Deploy Rápido

1. **Crear cuenta**: [vercel.com](https://vercel.com)

2. **Deploy desde CLI**
   ```bash
   npm i -g vercel
   vercel login
   cd cont
   vercel
   ```

3. **Deploy desde GitHub**
   - Conectar repositorio
   - Auto-deploy en cada push

4. **Configuración** (`vercel.json`):
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

---

## 🌍 Opción 4: GitHub Pages

### Limitaciones
- ⚠️ Solo funciona con repos públicos (gratis)
- No soporta SPAs nativamente (necesita workaround)

### Deploy

1. **Configurar en GitHub**
   ```
   Settings → Pages → Branch: main → Save
   ```

2. **Agregar `404.html`**
   ```bash
   cp index.html 404.html
   ```

3. **URL**: `https://tuusuario.github.io/mi-dinero`

---

## ✅ Checklist Post-Deploy

Después de desplegar en cualquier plataforma:

### 1. Configurar Firebase Authorized Domains

```
Firebase Console → Authentication → Settings → Authorized domains
Agregar:
  - tu-dominio.netlify.app
  - tu-dominio.web.app
  - tu-dominio-custom.com
```

### 2. Verificar PWA

Abrir en Chrome:
```
DevTools (F12) → Application → Manifest
Verificar:
  ✅ Manifest cargado
  ✅ Service Worker activo
  ✅ Iconos presentes
```

### 3. Test de Funcionalidad

- [ ] Login funciona
- [ ] Registro funciona
- [ ] Agregar ingreso/gasto
- [ ] Editar transacción
- [ ] Eliminar transacción
- [ ] Búsqueda funciona
- [ ] Filtros funcionan
- [ ] Exportar Excel
- [ ] Exportar PDF
- [ ] Gráficos se muestran
- [ ] Presupuesto funciona
- [ ] Logout funciona
- [ ] PWA instalable

### 4. Test de Performance

Usar [PageSpeed Insights](https://pagespeed.web.dev/):
```
- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >90
```

### 5. Test de Seguridad

- [ ] HTTPS activo (candado verde)
- [ ] Firestore rules activas
- [ ] Solo tu usuario ve tus datos
- [ ] Headers de seguridad configurados

---

## 🔧 Solución de Problemas

### Error: "Auth domain not whitelisted"

**Problema**: Firebase no autoriza tu dominio

**Solución**:
```
1. Firebase Console → Authentication → Settings
2. Scroll a "Authorized domains"
3. Click "Add domain"
4. Agregar tu URL de Netlify/Vercel/etc
5. Guardar
6. Esperar 5 minutos para propagación
```

### Error 404 en rutas

**Problema**: SPA no está configurado

**Solución**:
- **Netlify**: Verificar archivo `_redirects` existe
- **Vercel**: Crear `vercel.json` con rewrites
- **Firebase**: Verificar `firebase.json` tiene rewrites

### PWA no se puede instalar

**Problema**: Manifest o Service Worker

**Solución**:
```
1. Verificar HTTPS (PWA requiere HTTPS)
2. Abrir DevTools → Application
3. Ver errores en Manifest y Service Worker
4. Corregir paths en manifest.json
5. Verificar service-worker.js carga
```

### Gráficos/PDF no funcionan en producción

**Problema**: CDN bloqueados o CORS

**Solución**:
```
- Verificar que CDNs carguen (Network tab)
- Verificar consola para errores
- CDNs usados:
  ✅ Firebase (gstatic.com)
  ✅ Chart.js (jsdelivr.net)
  ✅ SheetJS (sheetjs.com)
  ✅ jsPDF (cdnjs.cloudflare.com)
```

---

## 📊 Monitoreo Post-Deploy

### Google Analytics (Opcional)

Agregar en `index.html` antes de `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Firebase Analytics (Integrado)

Ya incluido en Firebase SDK. Ver en:
```
Firebase Console → Analytics → Dashboard
```

---

## 🚀 Deploy con Dominio Personalizado

### En Netlify

1. **Comprar dominio** (Namecheap, GoDaddy, etc.)

2. **Configurar DNS**:
   ```
   Type: CNAME
   Name: www
   Value: tu-sitio.netlify.app
   ```

3. **En Netlify**:
   ```
   Site settings → Domain management → Add custom domain
   Agregar: www.tudominio.com
   ```

4. **HTTPS automático** (Netlify genera certificado SSL)

### En Firebase Hosting

```bash
firebase hosting:channel:deploy live
firebase hosting:site:list
firebase hosting:site:get
```

Seguir wizard en consola Firebase.

---

## 📱 Extras: App Stores (Futuro)

### PWA Builder (Convertir a App Nativa)

1. Ir a [pwabuilder.com](https://www.pwabuilder.com/)
2. Ingresar URL de tu app
3. Descargar paquetes para:
   - Google Play Store (Android)
   - Microsoft Store (Windows)
   - App Store (iOS requiere Mac)

---

## 🎯 Recomendaciones Finales

### Para Producción Seria

1. **Dominio Personalizado** - Más profesional
2. **Google Analytics** - Métricas de uso
3. **Error Tracking** - Sentry.io o LogRocket
4. **Backups** - Exportar Firestore periódicamente
5. **Monitoring** - UptimeRobot para verificar uptime
6. **CDN** - Cloudflare (gratis) para mejor performance

### Performance

- ✅ Minificar HTML/CSS/JS (Netlify lo hace automático)
- ✅ Comprimir imágenes (ya optimizadas)
- ✅ Lazy load de librerías (ya implementado)
- ✅ Service Worker (ya implementado)

---

## 📞 Soporte

Si tienes problemas:

1. **Revisar consola** (F12)
2. **Ver errores de Firebase** (Console)
3. **Verificar Firestore Rules**
4. **Verificar Authorized Domains**

---

## ✅ Checklist Final

Antes de decir "está en producción":

- [ ] Deploy exitoso en plataforma elegida
- [ ] HTTPS verificado (candado verde)
- [ ] PWA instalable
- [ ] Firebase Authorized Domains configurado
- [ ] Login funciona
- [ ] Todas las funcionalidades testeadas
- [ ] Performance >90 en Lighthouse
- [ ] Probado en 3+ navegadores
- [ ] Probado en móvil
- [ ] Dominio personalizado (opcional)
- [ ] Analytics configurado (opcional)

---

**¡Tu app está lista para el mundo! 🌍🚀**

**Deploy recomendado**: **Netlify** (más fácil y rápido)
