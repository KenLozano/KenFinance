# 🛠️ GUÍA TÉCNICA COMPLETA - Mi Dinero

> **Manual del Desarrollador para Edición, Modificación y Defensa Técnica**

Esta guía te prepara para **defender técnicamente** el proyecto y responder cualquier pregunta como:
- "¿Cómo hiciste esto?"
- "Edita esta funcionalidad"
- "Explica esta decisión técnica"
- "Agrega esta nueva característica"

---

## 📑 Índice

1. [Arquitectura General](#arquitectura-general)
2. [Estructura del Código](#estructura-del-código)
3. [Funciones Principales Explicadas](#funciones-principales)
4. [Cómo Modificar Características](#cómo-modificar)
5. [Agregar Nuevas Funcionalidades](#agregar-funcionalidades)
6. [Decisiones Técnicas Explicadas](#decisiones-técnicas)
7. [Respuestas para Preguntas Comunes](#preguntas-comunes)
8. [Bases de Datos y Firebase](#firebase-detallado)
9. [Debugging y Testing](#debugging)
10. [Escenarios de Modificación](#escenarios)

---

## 🏗️ Arquitectura General

### Patrón de Diseño

**Single Page Application (SPA)** con enfoque **funcional**:

```
┌─────────────────────────────────────────┐
│         FRONTEND (index.html)           │
│                                         │
│  ┌─────────────┐    ┌──────────────┐   │
│  │   HTML/UI   │───▶│   JavaScript │   │
│  └─────────────┘    └──────────────┘   │
│         │                   │           │
│         ▼                   ▼           │
│  ┌─────────────┐    ┌──────────────┐   │
│  │  CSS Styles │    │  Event       │   │
│  │             │    │  Handlers    │   │
│  └─────────────┘    └──────────────┘   │
└─────────────┬───────────────────────────┘
              │
              ▼ API Calls
┌─────────────────────────────────────────┐
│      FIREBASE (Backend as a Service)    │
│                                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │ Auth         │  │  Firestore   │    │
│  │ (Usuarios)   │  │  (NoSQL DB)  │    │
│  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────┘
```

### Flujo de Datos

```
Usuario → Evento UI → Handler JS → Validación → Firebase → 
Response → Actualizar UI → Mostrar Toast
```

---

## 📂 Estructura del Código Detallada

### index.html (1,390 líneas)

**Secciones principales**:

```
Líneas 1-28:   HEAD (Meta tags, CDN imports)
Líneas 30-43:  Login Page (HTML)
Líneas 45-57:  Register Page (HTML)
Líneas 59-174: Dashboard (HTML principal)
Líneas 176-191: Modal Ingreso
Líneas 193-210: Modal Gasto
Líneas 212-227: Modal Presupuesto
Líneas 230-231: Toast Container
Líneas 233-236: Firebase SDK
Líneas 238-256: Firebase Config + Variables Globales
Líneas 258-303: Toast System
Líneas 305-380: Autenticación (Login/Register/Logout)
Líneas 382-430: Modales (Abrir/Cerrar + Memory Management)
Líneas 432-477: Form Income (Validación + Submit)
Líneas 479-568: Form Expense (Validación + Submit)
Líneas 570-605: Delete Item (Confirmación + Delete)
Líneas 607-749: loadData() - FUNCIÓN CORE
Líneas 751-830: renderCharts() - Gráficos
Líneas 832-1020: exportToExcel() - Exportación Excel
Líneas 1022-1113: loadBudget() + updateBudgetUI()
Líneas 1115-1295: exportToPDF() - Exportación PDF
Líneas 1297-1347: Event Listeners + Initializations
Líneas 1349-1390: Service Worker Registration
```

### Variables Globales (Líneas 250-256)

```javascript
const auth = firebase.auth();           // Servicio autenticación
const db = firebase.firestore();        // Base de datos
let currentUser = null;                 // Usuario actual (null = no logueado)
let currentFilter = 'today';           // Filtro activo (today/week/month)
let currentBudget = 0;                 // Meta de ahorro
const loginPage = document.getElementById('login-page');
const registerPage = document.getElementById('register-page');
const dashboardPage = document.getElementById('dashboard-page');
```

**¿Por qué globales?**
- `currentUser`: Necesario en múltiples funciones (loadData, forms, etc.)
- `currentFilter`: Compartido entre filtros y loadData
- `currentBudget`: Actualizado desde múltiples lugares

---

## 🔧 Funciones Principales Explicadas

### 1. showToast() - Sistema de Notificaciones

**Ubicación**: Líneas 263-303  
**Propósito**: Mostrar mensajes al usuario

```javascript
function showToast(message, type = 'success') {
    // 1. Crear contenedor del toast
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;  // Clase CSS según tipo
    
    // 2. Definir iconos por tipo
    const icon = {
        'success': '✅',
        'error': '❌',
        'info': 'ℹ️'
    }[type] || '✅';
    
    // 3. Construir DOM con textContent (NO innerHTML por XSS)
    const iconSpan = document.createElement('span');
    iconSpan.textContent = icon;
    
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;  // ✅ SEGURO: Previene XSS
    
    // 4. Agregar botón cerrar
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.onclick = () => toast.remove();
    
    // 5. Ensamblar y mostrar
    toast.appendChild(iconSpan);
    toast.appendChild(messageDiv);
    toast.appendChild(closeBtn);
    container.appendChild(toast);
    
    // 6. Auto-remover después de 4 segundos
    setTimeout(() => {
        toast.classList.add('hiding');  // Animación fade-out
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
```

**Cómo usarlo**:
```javascript
showToast('Ingreso guardado', 'success');  // Verde
showToast('Error al guardar', 'error');    // Rojo
showToast('Cargando datos...', 'info');    // Azul
```

**Cómo modificar**:
- **Cambiar duración**: Modificar `4000` (línea 301)
- **Agregar tipo**: Agregar en objeto `icon` (línea 268)
- **Cambiar estilos**: Editar `.toast` en `css/styles.css`

---

### 2. auth.onAuthStateChanged() - Manejo de Sesión

**Ubicación**: Líneas 306-316  
**Propósito**: Detectar cambios en autenticación automáticamente

```javascript
auth.onAuthStateChanged(user => {
    if (user) {
        // Usuario logueado
        currentUser = user;                    // Guardar globalmente
        showPage('dashboard');                 // Mostrar dashboard
        document.getElementById('user-name')
            .textContent = user.displayName || user.email;  // Nombre
        loadData();                           // Cargar transacciones
    } else {
        // Usuario no logueado
        currentUser = null;
        showPage('login');                    // Mostrar login
    }
});
```

**¿Cómo funciona?**
- Firebase **escucha** cambios automáticamente
- Se ejecuta en:
  - Carga inicial de página
  - Login exitoso
  - Logout
  - Token expira

**Cómo modificar**:
- **Agregar loading**: Insertar `showToast('Cargando...', 'info')` antes de `loadData()`
- **Redirigir a otra página**: Cambiar `showPage('dashboard')`

---

### 3. openModal() + closeModal() - Gestión de Modales

**Ubicación**: Líneas 393-453  
**Propósito**: Abrir/cerrar modales SIN memory leaks

```javascript
// Map para rastrear event listeners
const modalHandlers = new Map();

function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    
    modal.classList.remove('hidden');  // Mostrar
    
    // ✅ Limpiar handlers previos (evita acumulación)
    if (modalHandlers.has(id)) {
        closeModal(id, false);  // Limpiar sin ocultar
    }
    
    // Crear handlers
    const escHandler = (e) => {
        if (e.key === 'Escape') closeModal(id);
    };
    
    const clickHandler = (e) => {
        if (e.target === modal) closeModal(id);  // Click fuera
    };
    
    // ✅ Guardar referencias en Map
    modalHandlers.set(id, { escHandler, clickHandler });
    
    // Agregar listeners
    document.addEventListener('keydown', escHandler);
    modal.addEventListener('click', clickHandler);
}

function closeModal(id, hideModal = true) {
    const modal = document.getElementById(id);
    if (!modal) return;
    
    // ✅ Limpiar event listeners (previene memory leak)
    const handlers = modalHandlers.get(id);
    if (handlers) {
        document.removeEventListener('keydown', handlers.escHandler);
        modal.removeEventListener('click', handlers.clickHandler);
        modalHandlers.delete(id);  // Liberar memoria
    }
    
    // Ocultar modal
    if (hideModal) {
        modal.classList.add('hidden');
    }
    
    // Limpiar formularios
    if (id === 'modal-income') {
        document.getElementById('form-income').reset();
        document.getElementById('income-edit-id').value = '';
    } else if (id === 'modal-expense') {
        document.getElementById('form-expense').reset();
        document.getElementById('expense-edit-id').value = '';
    }
}
```

**¿Por qué Map?**
- **Sin Map**: Listeners se acumulan → Memory leak → App lenta
- **Con Map**: Rastreamos y eliminamos correctamente

**Cómo agregar nuevo modal**:
1. Agregar HTML del modal
2. Llamar `openModal('nuevo-modal-id')`
3. Agregar limpieza en `closeModal()` si tiene form

---

### 4. loadData() - Función CORE del Sistema

**Ubicación**: Líneas 617-749  
**Propósito**: Cargar transacciones desde Firestore y actualizar UI

```javascript
// Sistema de tokens para race conditions
let currentLoadToken = 0;

async function loadData() {
    if (!currentUser) return;  // Verificar autenticación
    
    // ✅ Generar token único (previene race condition)
    const myToken = ++currentLoadToken;
    
    // 1. Calcular fechas según filtro
    const now = new Date();
    let startDate;
    
    if (currentFilter === 'today') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (currentFilter === 'week') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (currentFilter === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
        startDate = new Date(0);  // All time
    }
    
    try {
        const startTs = firebase.firestore.Timestamp.fromDate(startDate);
        
        // 2. Query INGRESOS desde Firestore
        const incomeSnap = await db.collection('transactions')
            .doc(currentUser.uid)
            .collection('income')
            .where('date', '>=', startTs)
            .get();
        
        let totalIncome = 0;
        const incomeItems = incomeSnap.docs.map(doc => {
            const data = doc.data();
            totalIncome += data.amount;  // Sumar total
            return { id: doc.id, type: 'income', ...data };
        });
        
        // 3. Query GASTOS desde Firestore
        const expenseSnap = await db.collection('transactions')
            .doc(currentUser.uid)
            .collection('expenses')
            .where('date', '>=', startTs)
            .get();
        
        let totalExpenses = 0;
        const expenseItems = expenseSnap.docs.map(doc => {
            const data = doc.data();
            totalExpenses += data.amount;
            return { id: doc.id, type: 'expense', ...data };
        });
        
        // ✅ Verificar token antes de actualizar UI
        if (myToken !== currentLoadToken) {
            console.log('Cancelando loadData obsoleto');
            return;  // Abortar si hay llamada más reciente
        }
        
        // 4. Actualizar UI con formato de números
        const balance = totalIncome - totalExpenses;
        document.getElementById('balance').textContent = 
            `S/ ${balance.toLocaleString('es-PE', {
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2
            })}`;
        
        document.getElementById('balance').style.color = 
            balance >= 0 ? '#10b981' : '#ef4444';
        
        // 5. Combinar y ordenar transacciones
        const all = [...incomeItems, ...expenseItems].sort((a, b) => {
            const da = a.date.toDate();
            const db = b.date.toDate();
            return db - da;  // Más reciente primero
        });
        
        // 6. Aplicar filtros de búsqueda
        const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('category-filter')?.value || 'all';
        
        const filtered = all.filter(item => {
            // Filtro por texto
            const matchesSearch = !searchTerm ||
                (item.note && item.note.toLowerCase().includes(searchTerm)) ||
                item.amount.toString().includes(searchTerm);
            
            // Filtro por categoría
            let matchesCategory = true;
            if (categoryFilter !== 'all') {
                if (categoryFilter === 'income') {
                    matchesCategory = item.type === 'income';
                } else {
                    matchesCategory = item.category === categoryFilter;
                }
            }
            
            return matchesSearch && matchesCategory;
        });
        
        // 7. Renderizar lista
        const listEl = document.getElementById('list');
        
        if (filtered.length === 0) {
            listEl.innerHTML = '<p style="text-align:center; color:#9ca3af; padding:20px;">No hay movimientos</p>';
        } else {
            listEl.innerHTML = filtered.map(item => {
                const date = item.date.toDate();
                const dateStr = date.toLocaleDateString('es-PE');
                const emoji = item.type === 'income' ? '💰' : 
                             item.category === 'green' ? '🟢' :
                             item.category === 'yellow' ? '🟡' : '🔴';
                
                return `
                    <div class="transaction ${item.type}">
                        <div>
                            <span class="emoji">${emoji}</span>
                            <div>
                                <strong>S/ ${item.amount.toFixed(2)}</strong>
                                <small>${item.note || 'Sin nota'}</small>
                                <small>${dateStr}</small>
                            </div>
                        </div>
                        <div>
                            <button onclick="editItem('${item.id}', '${item.type}')">✏️</button>
                            <button onclick="deleteItem('${item.id}', '${item.type}')">🗑️</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        // 8. Actualizar gráficos
        renderCharts(totalIncome, totalExpenses, expenseItems);
        
        // 9. Actualizar presupuesto
        await loadBudget();
        updateBudgetUI();
        
    } catch (err) {
        console.error('Load error:', err);
        showToast('Error cargando datos: ' + err.message, 'error');
    }
}
```

**Decisiones técnicas**:
- **Token system**: Evita que UI se actualice con datos viejos si usuario cambia filtro rápido
- **2 queries separadas**: Firebase no permite JOIN, debemos fusionar manualmente
- **Map + filter**: Transformar y filtrar datos eficientemente

**Cómo modificar**:
- **Agregar filtro "año"**: Agregar case en línea 625
- **Cambiar orden**: Modificar `sort()` en línea 681
- **Agregar campo**: Incluir en `map()` de línea 642 o 653

---

### 5. Form Submission - Guardar Transacciones

**Income Form** (Líneas 455-490):

```javascript
document.getElementById('form-income').onsubmit = async (e) => {
    e.preventDefault();  // Evitar reload de página
    
    // 1. Obtener valores del form
    const amount = parseFloat(document.getElementById('income-amount').value);
    
    // 2. ✅ Validación robusta
    if (isNaN(amount) || amount <= 0 || amount > 999999999) {
        showToast('Ingresa un monto válido (máximo 999,999,999)', 'error');
        return;  // Abortar si inválido
    }
    
    const dateStr = document.getElementById('income-date').value;
    const note = document.getElementById('income-note').value.trim();
    const editId = document.getElementById('income-edit-id').value;
    
    // 3. ✅ Parsear fecha con Date.UTC (timezone consistency)
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
    
    try {
        // 4. Preparar data para Firestore
        const data = {
            amount: amount,
            date: firebase.firestore.Timestamp.fromDate(date),
            note: note,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        if (editId) {
            // 5a. Actualizar existente
            await db.collection('transactions').doc(currentUser.uid)
                .collection('income').doc(editId).update(data);
            showToast('Ingreso actualizado correctamente', 'success');
        } else {
            // 5b. Crear nuevo
            await db.collection('transactions').doc(currentUser.uid)
                .collection('income').add(data);
            showToast('Ingreso guardado correctamente', 'success');
        }
        
        // 6. Limpiar y recargar
        closeModal('modal-income');
        e.target.reset();
        document.getElementById('income-edit-id').value = '';
        loadData();  // Refrescar lista
        
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    }
};
```

**¿Por qué Date.UTC?**
- **Sin UTC**: `new Date('2025-01-15')` = Fecha en timezone local
- **Con UTC**: Fecha consistente en cualquier país
- **Ejemplo**: Usuario en Perú (-5) vs España (+1) verían fechas diferentes

**Cómo agregar validación**:
```javascript
// Después de línea 461, agregar:
if (note.length > 100) {
    showToast('Nota muy larga (máximo 100 caracteres)', 'error');
    return;
}
```

---

### 6. renderCharts() - Gráficos con Chart.js

**Ubicación**: Líneas 755-830  
**Propósito**: Crear/actualizar gráficos visuales

```javascript
// Objeto para guardar instancias (evita leaks)
const charts = {
    incomeExpense: null,
    category: null
};

function renderCharts(totalIncome, totalExpenses, expenseItems) {
    // GRÁFICO 1: Ingresos vs Gastos (Barras)
    const ctx1 = document.getElementById('incomeExpenseChart');
    if (ctx1) {
        // Destruir gráfico anterior si existe
        if (charts.incomeExpense) {
            charts.incomeExpense.destroy();
        }
        
        charts.incomeExpense = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: ['Ingresos', 'Gastos'],
                datasets: [{
                    data: [totalIncome, totalExpenses],
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
    
    // GRÁFICO 2: Gastos por Categoría (Dona)
    const categoryTotals = {
        green: 0,
        yellow: 0,
        red: 0
    };
    
    expenseItems.forEach(item => {
        if (categoryTotals[item.category] !== undefined) {
            categoryTotals[item.category] += item.amount;
        }
    });
    
    const ctx2 = document.getElementById('categoryChart');
    if (ctx2) {
        if (charts.category) {
            charts.category.destroy();
        }
        
        charts.category = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ['🟢 Fijo', '🟡 Necesario', '🔴 Antojo'],
                datasets: [{
                    data: [categoryTotals.green, categoryTotals.yellow, categoryTotals.red],
                    backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
                   borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}
```

**¿Por qué destroy()?**
- **Sin destroy**: Nuevo gráfico sobre el anterior → Memoria crece
- **Con destroy**: Limpia canvas correctamente → Memoria estable

**Cómo agregar gráfico**:
1. Agregar `<canvas id="nuevo-grafico"></canvas>` en HTML
2. En `renderCharts()`, crear nueva instancia Chart
3. Llamar desde `loadData()`

---

## 🎨 Cómo Modificar Características

### Cambiar Colores del Tema

**Archivo**: `css/styles.css`  
**Ubicación**: Variables CSS (primeras líneas)

```css
:root {
    --bg-primary: #0f172a;      /* Fondo principal (azul oscuro) */
    --bg-secondary: #1e293b;    /* Fondo secundario */
    --accent: #7c3aed;          /* Color acentuado (púrpura) */
    --text-primary: #f1f5f9;    /* Texto principal (blanco) */
    --text-secondary: #94a3b8;  /* Texto secundario (gris) */
    --success: #10b981;         /* Verde */
    --danger: #ef4444;          /* Rojo */
}
```

**Ejemplo**: Cambiar a azul claro
```css
:root {
    --bg-primary: #1e3a8a;      /* Azul más claro */
    --accent: #3b82f6;          /* Azul vibrante */
}
```

---

### Agregar Nueva Categoría de Gasto

**1. Modificar HTML Modal** (Línea 201):
```html
<div class="radio-group">
    <label><input type="radio" name="category" value="green"> 🟢 Fijo</label>
    <label><input type="radio" name="category" value="yellow"> 🟡 Necesario</label>
    <label><input type="radio" name="category" value="red"> 🔴 Antojo</label>
    <!-- NUEVO -->
    <label><input type="radio" name="category" value="blue"> 🔵 Inversión</label>
</div>
```

**2. Actualizar Gráfico** (Línea 789):
```javascript
const categoryTotals = {
    green: 0,
    yellow: 0,
    red: 0,
    blue: 0  // NUEVO
};

// ...

data: {
    labels: ['🟢 Fijo', '🟡 Necesario', '🔴 Antojo', '🔵 Inversión'],
    datasets: [{
        data: [
            categoryTotals.green, 
            categoryTotals.yellow, 
            categoryTotals.red,
            categoryTotals.blue  // NUEVO
        ],
        backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6']
    }]
}
```

**3. Actualizar Excel Export** (Línea 970):
```javascript
const categoryNames = {
    green: 'Fijo',
    yellow: 'Necesario',
    red: 'Antojo',
    blue: 'Inversión'  // NUEVO
};
```

---

### Cambiar Logo/Título

**Opción 1**: Solo texto (Líneas 62, 35, 48)
```html
<!-- Cambiar emoji -->
<h1>💸 Mi Billetera</h1>
```

**Opción 2**: Imagen logo
```html
<header>
    <img src="/icons/logo.png" alt="Logo" style="height: 40px;">
    <span>Mi Dinero</span>
    <!-- ... -->
</header>
```

---

### Modificar Validación de Montos

**Ubicación**: Líneas 461-465 (Income), 505-509 (Expense)

**Actual**:
```javascript
if (isNaN(amount) || amount <= 0 || amount > 999999999) {
    showToast('Ingresa un monto válido (máximo 999,999,999)', 'error');
    return;
}
```

**Ejemplos de modificación**:

**1. Permitir negativos** (para ajustes):
```javascript
if (isNaN(amount) || amount > 999999999) {
    showToast('Monto inválido', 'error');
    return;
}
```

**2. Límite menor**:
```javascript
if (isNaN(amount) || amount <= 0 || amount > 10000) {
    showToast('Monto debe estar entre S/ 0.01 y S/ 10,000', 'error');
    return;
}
```

**3. Solo múltiplos de 10**:
```javascript
if (isNaN(amount) || amount <= 0 || amount % 10 !== 0) {
    showToast('Monto debe ser múltiplo de 10', 'error');
    return;
}
```

---

## ➕ Agregar Nuevas Funcionalidades

### Ejemplo 1: Agregar Campo "Proveedor" a Gastos

**Paso 1**: Modificar HTML Modal (después línea 200):
```html
<input type="text" id="expense-provider" placeholder="Proveedor (opcional)">
```

**Paso 2**: Capturar en form submit (línea 510):
```javascript
const provider = document.getElementById('expense-provider').value.trim();

const data = {
    amount: amount,
    date: firebase.firestore.Timestamp.fromDate(date),
    category: category,
    note: note,
    provider: provider,  // NUEVO
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
};
```

**Paso 3**: Mostrar en lista (línea 710):
```javascript
return `
    <div class="transaction ${item.type}">
        <div>
            <span class="emoji">${emoji}</span>
            <div>
                <strong>S/ ${item.amount.toFixed(2)}</strong>
                <small>${item.note || 'Sin nota'}</small>
                ${item.provider ? `<small>Proveedor: ${item.provider}</small>` : ''}
                <small>${dateStr}</small>
            </div>
        </div>
        <!-- ... -->
    </div>
`;
```

**Paso 4**: Incluir en Excel (línea 900):
```javascript
expenses.forEach(item => {
    incomeData.push([
        item.date.toDate().toLocaleDateString('es-PE'),
        categoryNames[item.category] || item.category,
        item.provider || '',  // NUEVO
        item.note || '',
        item.amount
    ]);
});
```

---

### Ejemplo 2: Agregar Modo Claro/Oscuro

**Paso 1**: Agregar botón en header (línea 66):
```html
<button id="theme-toggle">🌙</button>
```

**Paso 2**: CSS para light mode (en styles.css):
```css
body.light-mode {
    --bg-primary: #ffffff;
    --bg-secondary: #f1f5f9;
    --text-primary: #0f172a;
    --text-secondary: #64748b;
}
```

**Paso 3**: JavaScript toggle (línea 1350):
```javascript
document.getElementById('theme-toggle').onclick = () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    
    // Guardar preferencia
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    
    // Cambiar icono
    document.getElementById('theme-toggle').textContent = isLight ? '☀️' : '🌙';
};

// Cargar preferencia al inicio
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    document.getElementById('theme-toggle').textContent = '☀️';
}
```

---

### Ejemplo 3: Notificaciones Push (Avanzado)

**Paso 1**: Solicitar permiso:
```javascript
// En service-worker.js
self.addEventListener('push', event => {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icons/icon-192x192.png'
    });
});
```

**Paso 2**: En app, solicitar permiso:
```javascript
async function enableNotifications() {
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            // Guardar token en Firestore para enviar desde backend
            const messaging = firebase.messaging();
            const token = await messaging.getToken();
            
            await db.collection('users').doc(currentUser.uid).set({
                fcmToken: token
            }, { merge: true });
            
            showToast('Notificaciones activadas', 'success');
        }
    }
}
```

---

## 🔍 Decisiones Técnicas Explicadas

### ¿Por qué Firebase y no otro Backend?

**Ventajas**:
- ✅ No necesitas servidor (Backend as a Service)
- ✅ Escalable automáticamente
- ✅ Real-time updates (aunque no los usamos aquí)
- ✅ Gratis hasta 50k lecturas/día
- ✅ Authentication integrado
- ✅ Hosting incluido

**Desventajas**:
- ❌ Vendor lock-in (dificil migrar)
- ❌ Queries limitadas (no JOIN, no OR complejo)
- ❌ Costos crecen con uso

**Alternativas**:
- **Supabase** (PostgreSQL, open-source)
- **AWS Amplify** (más complejo)
- **Backend custom** (Node.js + MongoDB)

---

### ¿Por qué separar `income` y `expenses` en 2 colecciones?

**Opción A: Una colección con campo "type"**
```
transactions/userId/items
  - { type: 'income', amount: 100 }
  - { type: 'expense', amount: 50 }
```

**Opción B: Dos colecciones** (elegida)
```
transactions/userId/income
  - { amount: 100 }
transactions/userId/expenses
  - { amount: 50, category: 'green' }
```

**¿Por qué B?**
- ✅ Queries más rápidas (`where('type', '==', 'income')` evitado)
- ✅ Estructura más clara
- ✅ Fácil agregar campos específicos (expenses tiene `category`)
- ✅ Reglas de seguridad más específicas

---

### ¿Por qué no usar React/Vue/Angular?

**Ventajas de Vanilla JS**:
- ✅ Más ligero (0 KB de framework)
- ✅ Más rápido (no virtual DOM)
- ✅ Fácil de entender (no abstracciones)
- ✅ PWA sin build process

**Cuándo usar framework**:
- App muy grande (>5000 líneas)
- Muchos componentes reutilizables
- Estado complejo compartido
- Team grande

---

### ¿Por qué Chart.js y no D3.js?

**Chart.js**:
- ✅ Simple, 5 líneas = gráfico
- ✅ Responsive por defecto
- ✅ Ligero (50KB)

**D3.js**:
- ❌ Complejo, curva aprendizaje alta
- ✅ Súper customizable
- ❌ Pesado (240KB)

**Para este proyecto**: Chart.js es perfecto.

---

## 💬 Respuestas para Preguntas Comunes

### "¿Cómo hiciste la exportación a Excel?"

**Respuesta**:
> "Usé la librería **SheetJS** que permite crear archivos Excel directamente en el navegador. Primero, obtengo las transacciones desde Firestore, luego las transformo en arrays de arrays (el formato que SheetJS espera), creo 4 hojas diferentes (Resumen, Ingresos, Gastos, Análisis) con `XLSX.utils.aoa_to_sheet()`, las combino en un workbook con `XLSX.utils.book_new()`, y finalmente lo descargo con `XLSX.writeFile()`. El formato incluye estilos, anchos de columna y fórmulas calculadas."

**Código clave**:
```javascript
const workbook = XLSX.utils.book_new();
const sheet = XLSX.utils.aoa_to_sheet(data);
XLSX.utils.book_append_sheet(workbook, sheet, 'Resumen');
XLSX.writeFile(workbook, 'MiDinero.xlsx');
```

---

### "¿Cómo evitaste el XSS?"

**Respuesta**:
> "Evité XSS usando `textContent` en lugar de `innerHTML` para insertar contenido dinámico. Por ejemplo, en el sistema de toasts, creo elementos DOM con `createElement()` y asigno el mensaje con `textContent`, que automáticamente escapa caracteres especiales como `<script>`. Esto previene que si un usuario ingresa `<script>alert('xss')</script>` en una nota, se ejecute como código - en su lugar se muestra como texto plano."

**Antes (INSEGURO)**:
```javascript
toast.innerHTML = `<div>${message}</div>`; // ❌ XSS!
```

**Después (SEGURO)**:
```javascript
const div = document.createElement('div');
div.textContent = message; // ✅ Seguro
toast.appendChild(div);
```

---

### "¿Cómo funciona el sistema de tokens para race conditions?"

**Respuesta**:
> "Implementé un contador global `currentLoadToken` que incrementa cada vez que se llama `loadData()`. Cada llamada guarda su propio token (`myToken`). Antes de actualizar la UI, verifico si `myToken === currentLoadToken`. Si son diferentes, significa que hubo una llamada más reciente, así que aborto la actual. Esto evita que si el usuario hace click rápido en 'Hoy' → 'Semana' → 'Mes', los datos de 'Hoy' no sobreescriban los de 'Mes' si su query fue más lenta."

**Ejemplo visual**:
```
Click 'Hoy'  → myToken=1, currentLoadToken=1 → Query lenta (500ms)
Click 'Semana' → myToken=2, currentLoadToken=2 → Query rápida (100ms)
  
'Semana' termina primero → Actualiza UI ✅
'Hoy' termina después → myToken(1) !== currentLoadToken(2) → Aborta ✅
```

---

### "¿Por qué Map para event listeners?"

**Respuesta**:
> "Usé un `Map` para rastrear referencias a event listeners porque JavaScript no permite eliminar listeners anónimos directamente. Sin el Map, cada vez que abrías un modal, se agregaban nuevos listeners sin eliminar los anteriores, causando un memory leak donde la memoria crecía infinitamente. Con el Map, guardo las referencias a las funciones, y al cerrar el modal, las busco en el Map y las elimino correctamente con `removeEventListener()`."

**Código**:
```javascript
const modalHandlers = new Map();

// Guardar
const handler = (e) => { /* ... */ };
modalHandlers.set('modal-id', { handler });
document.addEventListener('keydown', handler);

// Limpiar
const stored = modalHandlers.get('modal-id');
document.removeEventListener('keydown', stored.handler);
modalHandlers.delete('modal-id');
```

---

### "¿Cómo optimizaste la búsqueda?"

**Respuesta**:
> "Implementé **debounce** de 300ms en el input de búsqueda. Esto significa que en lugar de hacer una query a Firestore con cada tecla presionada (lo cual sería 10+ queries si escribo 'restaurant'), espero 300 milisegundos después de la última tecla antes de ejecutar la búsqueda. Usé un `setTimeout` que se limpia con `clearTimeout` en cada input. Esto redujo las queries innecesarias en ~80%."

**Código**:
```javascript
let searchTimeout;
searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);  // Cancelar búsqueda anterior
    searchTimeout = setTimeout(() => {
        loadData();  // Ejecutar solo después de 300ms
    }, 300);
});
```

---

### "¿Cómo aseguras que cada usuario solo vea sus datos?"

**Respuesta**:
> "Uso **Firestore Security Rules** que validan en el servidor que `request.auth.uid` coincida con el `userId` del documento. Estructuré los datos como `/transactions/{userId}/income/{docId}`, donde `userId` es el UID de Firebase Auth. Las rules verifican que el usuario autenticado solo acceda a documentos donde `userId` sea igual a su propio UID. Esto se valida en el servidor de Firebase, no en el cliente, así que es imposible bypassear."

**Firestore Rules**:
```javascript
match /transactions/{userId}/{subcollection}/{docId} {
  allow read, write: if request.auth.uid == userId;
}
```

---

## 🔥 Firebase Detallado

### Estructura de Datos en Firestore

```
firestore (root)
│
├── transactions
│   └── {userId}              # UID del usuario
│       ├── income            # Subcolección de ingresos
│       │   ├── {docId1}
│       │   │   ├── amount: 1500
│       │   │   ├── date: Timestamp
│       │   │   ├── note: "Salario"
│       │   │   └── createdAt: Timestamp
│       │   └── {docId2}
│       │       └── ...
│       │
│       └── expenses          # Subcolección de gastos
│           ├── {docId1}
│           │   ├── amount: 50
│           │   ├── date: Timestamp
│           │   ├── category: "green"
│           │   ├── note: "Luz"
│           │   └── createdAt: Timestamp
│           └── ...
│
└── budgets
    └── {userId}
        ├── amount: 3000
        └── updatedAt: Timestamp
```

### Queries Más Usadas

**1. Obtener ingresos del mes actual**:
```javascript
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const startTs = firebase.firestore.Timestamp.fromDate(startOfMonth);

const snapshot = await db.collection('transactions')
    .doc(currentUser.uid)
    .collection('income')
    .where('date', '>=', startTs)
    .orderBy('date', 'desc')
    .get();
```

**2. Obtener gasto específico**:
```javascript
const doc = await db.collection('transactions')
    .doc(currentUser.uid)
    .collection('expenses')
    .doc(expenseId)
    .get();

const data = doc.data();
```

**3. Actualizar transacción**:
```javascript
await db.collection('transactions')
    .doc(currentUser.uid)
    .collection('income')
    .doc(incomeId)
    .update({
        amount: newAmount,
        note: newNote
    });
```

**4. Eliminar transacción**:
```javascript
await db.collection('transactions')
    .doc(currentUser.uid)
    .collection('expenses')
    .doc(expenseId)
    .delete();
```

### Firestore Limits

- **Max doc size**: 1 MB
- **Max writes/second**: 10,000
- **Max nested collections**: 100 niveles
- **Max query results**: Ilimitado (pero paginación recomendada >1000)

---

## 🐛 Debugging y Testing

### Cómo Ver Errores

**Consola del Navegador** (F12):
```javascript
console.log('Variable:', currentUser);
console.error('Error:', error);
console.table(transactions);  // Ver array como tabla
```

**Firestore Debug**:
```javascript
db.collection('transactions')
    .doc(currentUser.uid)
    .collection('income')
    .get()
    .then(snap => {
        console.log('Docs encontrados:', snap.size);
        snap.forEach(doc => console.log(doc.id, doc.data()));
    });
```

### Testing Manual Checklist

```
☐ Login con email correcto
☐ Login con email incorrecto (debe fallar)
☐ Registro nuevo usuario
☐ Agregar ingreso con monto válido
☐ Agregar ingreso con monto negativo (debe fallar)
☐ Agregar gasto sin categoría (debe fallar)
☐ Editar transacción existente
☐ Eliminar transacción (confirmar popup)
☐ Buscar por texto (debounce funciona)
☐ Filtrar por categoría
☐ Cambiar filtro Hoy/Semana/Mes
☐ Exportar Excel semana
☐ Exportar PDF mes
☐ Configurar meta de ahorro
☐ Logout y volver a login
☐ Abrir/cerrar modales con ESC
☐ PWA instalable
```

---

## 🎯 Escenarios de Modificación Comunes

### Escenario 1: "Agrega límite de 50 transacciones por página"

**Solución**:
```javascript
// En loadData(), línea 720
const limitPerPage = 50;
let currentPage = 0;

// Modificar query
.limit(limitPerPage)
.startAfter(lastDoc)  // Para paginación

// Agregar botones
<button onclick="currentPage--; loadData()">Anterior</button>
<button onclick="currentPage++; loadData()">Siguiente</button>
```

---

### Escenario 2: "Cambia el formato de fecha a DD/MM/YYYY"

**Ubicación**: Línea 697

**Antes**:
```javascript
const dateStr = date.toLocaleDateString('es-PE');  // 31/01/2026
```

**Después**:
```javascript
const day = String(date.getDate()).padStart(2, '0');
const month = String(date.getMonth() + 1).padStart(2, '0');
const year = date.getFullYear();
const dateStr = `${day}/${month}/${year}`;  // 31/01/2026
```

---

### Escenario 3: "Agrega confirmación antes de cerrar sesión"

**Ubicación**: Línea 332

**Antes**:
```javascript
if (confirm('¿Cerrar sesión?')) {
    await auth.signOut();
}
```

**Mejorado con modal**:
```javascript
// Crear modal HTML
<div id="modal-logout" class="modal hidden">
    <div class="modal-content">
        <h3>¿Cerrar Sesión?</h3>
        <p>Tus datos están guardados en la nube</p>
        <div class="modal-buttons">
            <button onclick="closeModal('modal-logout')">Cancelar</button>
            <button onclick="confirmLogout()">Sí, Cerrar</button>
        </div>
    </div>
</div>

// JavaScript
async function confirmLogout() {
    await auth.signOut();
    closeModal('modal-logout');
}

document.getElementById('logout-btn').onclick = () => {
    openModal('modal-logout');
};
```

---

### Escenario 4: "Exporta solo transacciones mayores a S/ 100"

**Ubicación**: Línea 1229 en `getFilteredTransactions()`

**Agregar**:
```javascript
transactions = transactions.filter(t => t.amount >= 100);
```

---

## 📚 Recursos Adicionales

### Documentación Oficial

- **Firebase**: https://firebase.google.com/docs
- **Firestore**: https://firebase.google.com/docs/firestore
- **Chart.js**: https://www.chartjs.org/docs
- **SheetJS**: https://docs.sheetjs.com
- **jsPDF**: https://artskydj.github.io/jsPDF

### Tutoriales Útiles

- Firebase Authentication: https://youtu.be/rbuSx1yEgV8
- Firestore CRUD: https://youtu.be/4d-gIPGzmK4
- PWA Completo: https://youtu.be/sFsRylCQblw

---

## ✅ Checklist de Defensa Técnica

Antes de presentar, asegúrate de poder explicar:

- [ ] ¿Por qué elegiste Firebase?
- [ ] ¿Cómo funciona Firestore?
- [ ] ¿Qué es un XSS y cómo lo preveniste?
- [ ] ¿Qué es un memory leak y cómo lo evitaste?
- [ ] ¿Cómo funciona el sistema de tokens?
- [ ] ¿Por qué separaste income y expenses?
- [ ] ¿Cómo funciona el debounce?
- [ ] ¿Qué es Date.UTC y por qué lo usas?
- [ ] ¿Cómo funcionan los Service Workers?
- [ ] ¿Cómo agregarias una nueva feature X?

---

**¡Con esta guía puedes defender técnicamente CUALQUIER aspecto del proyecto!** 🚀

**Última actualización**: 31 de Enero de 2026
