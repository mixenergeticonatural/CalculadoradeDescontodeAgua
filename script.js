let currentDiscount = 50;
let currentSaving = 22;
let currentType = 'residential';

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function calculateResults() {
    const billInput = document.getElementById('bill-value');
    const billValue = parseFloat(billInput.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;

    const monthlyEconomy = (billValue * currentDiscount) / 100;
    const yearlyEconomy = monthlyEconomy * 12;
    const savingValue = (monthlyEconomy * currentSaving) / 100;
    const realMonthlyEconomy = monthlyEconomy - savingValue;
    const realYearlyEconomy = realMonthlyEconomy * 12;
    const realEconomyPercentage = (realMonthlyEconomy / billValue) * 100 || 0;

    // Installation values
    const isResidential = currentType === 'residential';
    const installmentValue = isResidential ? 39.90 : 79.90;
    const installments = isResidential ? 5 : 8;
    const totalInstallation = installmentValue * installments;

    // First payment calculation
    const balance = realMonthlyEconomy - totalInstallation;
    const formula = `${formatCurrency(realMonthlyEconomy)} - ${formatCurrency(totalInstallation)} = ${formatCurrency(balance)}`;

    // Update discount card style based on balance
    const discountCard = document.querySelector('.discount-card');
    const freeInstallationText = document.getElementById('free-installation-text');
    
    if (balance >= 0) {
        discountCard.classList.remove('negative');
        discountCard.classList.add('positive');
        if (!freeInstallationText) {
            const text = document.createElement('div');
            text.id = 'free-installation-text';
            text.className = 'free-installation';
            text.textContent = '✨ Instalação sai de graça e ainda sobra dinheiro! ✨';
            discountCard.appendChild(text);
        }
    } else {
        discountCard.classList.remove('positive');
        discountCard.classList.add('negative');
        if (freeInstallationText) {
            freeInstallationText.remove();
        }
    }

    document.getElementById('monthly-economy').textContent = formatCurrency(monthlyEconomy);
    document.getElementById('yearly-economy').textContent = formatCurrency(yearlyEconomy);
    document.getElementById('saving-value').textContent = formatCurrency(savingValue);
    document.getElementById('real-monthly-economy').textContent = formatCurrency(realMonthlyEconomy);
    document.getElementById('real-yearly-economy').textContent = formatCurrency(realYearlyEconomy);
    document.getElementById('real-economy-percentage').textContent = `${realEconomyPercentage.toFixed(2)}%`;
    
    document.getElementById('installation-value').textContent = `${installments}x ${formatCurrency(installmentValue)}`;
    document.getElementById('installation-total').textContent = `Total: ${formatCurrency(totalInstallation)}`;
    
    document.getElementById('first-payment').textContent = formatCurrency(balance);
    document.getElementById('payment-formula').textContent = formula;
}

// Format input as currency
const billInput = document.getElementById('bill-value');
billInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value) {
        value = (parseInt(value) / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        e.target.value = value;
    }
    calculateResults();
});

// Handle type selection
const typeButtons = document.querySelectorAll('.type-button');
typeButtons.forEach(button => {
    button.addEventListener('click', function() {
        typeButtons.forEach(btn => btn.classList.remove('selected'));
        this.classList.add('selected');
        currentType = this.dataset.type;
        calculateResults();
    });
});

// Handle discount button
const discountButton = document.getElementById('discount-button');
const discountOptions = document.getElementById('discount-options');

discountButton.addEventListener('dblclick', function() {
    discountOptions.classList.remove('hidden');
});

document.addEventListener('click', function(e) {
    if (!discountOptions.contains(e.target) && e.target !== discountButton) {
        discountOptions.classList.add('hidden');
    }
});

discountOptions.addEventListener('click', function(e) {
    if (e.target.classList.contains('option-button')) {
        currentDiscount = parseFloat(e.target.dataset.value);
        discountButton.textContent = `${currentDiscount}%`;
        discountOptions.classList.add('hidden');
        calculateResults();
    }
});

// Handle saving button
const savingButton = document.getElementById('saving-button');
const savingOptions = document.getElementById('saving-options');

savingButton.addEventListener('dblclick', function() {
    savingOptions.classList.remove('hidden');
});

document.addEventListener('click', function(e) {
    if (!savingOptions.contains(e.target) && e.target !== savingButton) {
        savingOptions.classList.add('hidden');
    }
});

savingOptions.addEventListener('click', function(e) {
    if (e.target.classList.contains('option-button')) {
        currentSaving = parseFloat(e.target.dataset.value);
        savingButton.textContent = `${currentSaving}%`;
        savingOptions.classList.add('hidden');
        calculateResults();
    }
});

// Initial calculation
calculateResults();
