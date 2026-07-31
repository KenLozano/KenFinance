// js/ui/render.js — Safe DOM rendering (no innerHTML)

const CATEGORY_LABELS = { green: 'Fijo', yellow: 'Necesario', red: 'Antojo' };
const VALID_CATEGORIES = ['green', 'yellow', 'red'];

function createTransactionElement(item) {
    const isIncome = item.type === 'income';
    const date = item?.date?.toDate?.() || new Date(0);
    const dateStr = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

    const el = document.createElement('div');
    el.className = `item ${isIncome ? 'income' : 'expense'}`;

    // Left side
    const leftDiv = document.createElement('div');

    const strong = document.createElement('strong');
    strong.textContent = item.note || (isIncome ? 'Ingreso' : 'Gasto');

    if (!isIncome && VALID_CATEGORIES.includes(item.category)) {
        const badge = document.createElement('span');
        badge.className = `category-badge badge-${item.category}`;
        badge.textContent = CATEGORY_LABELS[item.category] || '';
        strong.appendChild(badge);
    }

    const dateSmall = document.createElement('small');
    dateSmall.textContent = dateStr;

    const metaSmall = document.createElement('small');
    metaSmall.className = 'item-meta';
    metaSmall.textContent = isIncome
        ? `Fuente: ${item.source || 'otros'} · Cuenta: ${item.account || 'efectivo'}${item.tags ? ` · Etiquetas: ${item.tags}` : ''}`
        : `Comercio: ${item.merchant || '-'} · Método: ${item.method || 'efectivo'} · Prioridad: ${item.priority || 'media'}`;


    leftDiv.append(strong, dateSmall, metaSmall);

    // Right side
    const rightDiv = document.createElement('div');
    rightDiv.className = 'item-right';

    const amountSpan = document.createElement('span');
    amountSpan.className = isIncome ? 'green' : 'red';
    const amount = Number(item.amount);
    amountSpan.textContent = `${isIncome ? '+' : '-'} S/ ${(Number.isFinite(amount) ? amount : 0).toFixed(2)}`;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'item-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.dataset.id = item.id;
    editBtn.dataset.type = isIncome ? 'income' : 'expense';
    editBtn.textContent = '✏️';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.dataset.id = item.id;
    deleteBtn.dataset.type = isIncome ? 'income' : 'expense';
    deleteBtn.textContent = '🗑️';

    actionsDiv.append(editBtn, deleteBtn);
    rightDiv.append(amountSpan, actionsDiv);

    el.append(leftDiv, rightDiv);
    return el;
}

/**
 * Renderiza la lista de transacciones usando DOM API seguro (no innerHTML).
 */
export function renderTransactionList(listEl, filtered) {
    if (!listEl) return;

    listEl.textContent = '';

    if (filtered.length === 0) {
        const p = document.createElement('p');
        p.className = 'empty';
        p.textContent = 'No hay movimientos en este período';
        listEl.appendChild(p);
    } else {
        const fragment = document.createDocumentFragment();
        for (const item of filtered) {
            fragment.appendChild(createTransactionElement(item));
        }
        listEl.appendChild(fragment);
    }
}
