function showView(viewId, category = 'all') {
    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('catalog-view').classList.add('hidden');

    document.getElementById(viewId + '-view').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewId === 'catalog') {
        filterCatalog(category);
    }
}

function filterCatalog(category) {
    const items = document.querySelectorAll('.service-item');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => {
        btn.classList.remove('bg-lodz-navy', 'text-white', 'active');
        btn.classList.add('bg-gray-200', 'text-gray-700');

        const btnCategory = btn.getAttribute('data-filter');

        if (btnCategory === category) {
            btn.classList.remove('bg-gray-200', 'text-gray-700');
            btn.classList.add('bg-lodz-navy', 'text-white', 'active');
        }
    });

    items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function openModal(serviceName, price) {
    document.getElementById('modal-service-name').innerText = "Wybrana usługa: " + serviceName;
    document.getElementById('modal-service-price').innerText = "Cena: " + price;

    document.getElementById('purchase-form-container').classList.remove('hidden');
    document.getElementById('success-message').classList.add('hidden');
    document.getElementById('purchase-form').reset();

    document.getElementById('purchase-modal').classList.remove('hidden');

    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('purchase-modal').classList.add('hidden');

    document.body.style.overflow = '';
}

function handleBackdropClick(event) {
    if (event.target.id === 'purchase-modal') {
        closeModal();
    }
}

function submitForm(event) {
    event.preventDefault();
    document.getElementById('purchase-form-container').classList.add('hidden');
    document.getElementById('success-message').classList.remove('hidden');
}