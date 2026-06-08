document.addEventListener('DOMContentLoaded', () => {
    const purchaseForm = document.getElementById('purchase-form');
    if (purchaseForm) {
        purchaseForm.addEventListener('submit', submitForm);
    }

    const purchaseModal = document.getElementById('purchase-modal');
    if (purchaseModal) {
        purchaseModal.addEventListener('click', handleBackdropClick);
    }
});

function showView(viewId, category = 'all') {
    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('catalog-view').classList.add('hidden');

    document.getElementById('about-view').classList.add('hidden');

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
    // Przerywa domyślną akcję wysyłania formularza, np. przeładowanie strony
    event.preventDefault();
    document.getElementById('purchase-form-container').classList.add('hidden');
    document.getElementById('success-message').classList.remove('hidden');
}

/**
 * Automatycznie formatuje wpisywany numer telefonu w XXX XXX XXX
 * Limit do 9 cyfr jest obsługiwany przez usuwanie nadmiaru po czyszczeniu
 */
function formatPhone(inputElement) {
    let rawValue = inputElement.value.replace(/\D/g, '');

    if (rawValue.length > 9) {
        rawValue = rawValue.substring(0, 9);
    }

    let formattedValue = '';
    for (let i = 0; i < rawValue.length; i++) {
        if (i > 0 && i % 3 === 0) {
            formattedValue += ' ';
        }
        formattedValue += rawValue[i];
    }

    inputElement.value = formattedValue;
}

/**
 * Automatycznie formatuje wpisywany kod pocztowy w XX-XXX
 */
function formatZipCode(inputElement) {
    let rawValue = inputElement.value.replace(/\D/g, '');

    if (rawValue.length > 5) {
        rawValue = rawValue.substring(0, 5);
    }

    if (rawValue.length > 2) {
        inputElement.value = rawValue.substring(0, 2) + '-' + rawValue.substring(2);
    } else {
        inputElement.value = rawValue;
    }
}

/**
 * Przewija stronę do stopki i aktywuje animację podświetlenia
 */

let glowTimeout;

function scrollToContact() {
    const footer = document.getElementById('footer');

    footer.scrollIntoView({ behavior: 'smooth' });

    if (glowTimeout) {
        clearTimeout(glowTimeout);
    }

    footer.classList.remove('highlight-footer');

    void footer.offsetWidth;

    footer.classList.add('highlight-footer');

    glowTimeout = setTimeout(() => {
        footer.classList.remove('highlight-footer');
    }, 1500);
}