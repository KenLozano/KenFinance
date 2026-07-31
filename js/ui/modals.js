// js/ui/modals.js — Modal open/close with proper cleanup

const modalHandlers = new Map();

export function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('hidden');

    if (modalHandlers.has(id)) closeModal(id, false);

    const escHandler = (e) => { if (e.key === 'Escape') closeModal(id); };
    const clickHandler = (e) => { if (e.target === modal) closeModal(id); };

    modalHandlers.set(id, { escHandler, clickHandler });
    document.addEventListener('keydown', escHandler);
    modal.addEventListener('click', clickHandler);
}

export function closeModal(id, hideModal = true) {
    const modal = document.getElementById(id);
    if (!modal) return;

    const handlers = modalHandlers.get(id);
    if (handlers) {
        document.removeEventListener('keydown', handlers.escHandler);
        modal.removeEventListener('click', handlers.clickHandler);
        modalHandlers.delete(id);
    }

    if (hideModal) {
        modal.classList.add('hidden');
        if (id === 'modal-income') {
            document.getElementById('form-income')?.reset();
            const editId = document.getElementById('income-edit-id');
            if (editId) editId.value = '';
        } else if (id === 'modal-expense') {
            document.getElementById('form-expense')?.reset();
            const editId = document.getElementById('expense-edit-id');
            if (editId) editId.value = '';
        }
    }
}
