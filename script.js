let currentType = 'residential';
const savingPercentage = 22;

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function calculateResults() {
    const billInput = document.getElementById('bill-value');
    const discountRange = document.getElementById('discount-range');
    const billValue = parseFloat(billInput.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    const discountPercentage = parseInt(discountRange.value);

    const monthlyEconomy = (billValue * discountPercentage) / 100;
    const yearlyEconomy = monthlyEconomy * 12;
    const savingValue = (monthlyEconomy * savingPercentage) / 100;
    const realMonthlyEconomy = monthlyEconomy - savingValue;
    const realYearlyEconomy = realMonthlyEconomy * 12;
    const realEconomyIn5Years = realYearlyEconomy * 5;

    const isResidential = currentType === 'residential';
    const totalInstallation = isResidential ? 280.00 : 690.00;
    const installmentValue = isResidential ? 55.99 : 86.25;
    const installments = isResidential ? 5 : 8;

    // Update installation values
    document.getElementById('installation-value').textContent = formatCurrency(totalInstallation);
    document.getElementById('installation-total').textContent = 
        `${installments}x de ${formatCurrency(installmentValue)}`;

    // Update economy values
    document.getElementById('monthly-economy').textContent = formatCurrency(monthlyEconomy);
    document.getElementById('yearly-economy').textContent = formatCurrency(yearlyEconomy);
    document.getElementById('saving-value').textContent = formatCurrency(savingValue);
    document.getElementById('real-monthly-economy').textContent = formatCurrency(realMonthlyEconomy);
    document.getElementById('real-yearly-economy').textContent = formatCurrency(realYearlyEconomy);
    document.getElementById('real-economy-5-years').textContent = formatCurrency(realEconomyIn5Years);

    // Calculate and update first payment
    const balance = realMonthlyEconomy - totalInstallation;
    
    document.getElementById('first-payment').textContent = formatCurrency(balance);
    document.getElementById('payment-formula').textContent = 
        `${formatCurrency(realMonthlyEconomy)} - ${formatCurrency(totalInstallation)} = ${formatCurrency(balance)}`;

    // Update discount card style
    const discountCard = document.querySelector('.discount-card');
    const existingMessage = discountCard.querySelector('.free-installation');
    
    if (balance >= 0) {
        discountCard.classList.remove('negative');
        discountCard.classList.add('positive');
        if (!existingMessage) {
            const message = document.createElement('div');
            message.className = 'free-installation';
            message.textContent = '✨ Instalação sai de graça e ainda sobra dinheiro!';
            discountCard.appendChild(message);
        }
    } else {
        discountCard.classList.remove('positive');
        discountCard.classList.add('negative');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
}

// Format bill input as currency
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

// Handle discount range
const discountRange = document.getElementById('discount-range');
const discountValue = document.getElementById('discount-value');

discountRange.addEventListener('input', function() {
    discountValue.textContent = `${this.value}%`;
    calculateResults();
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

// Initialize calculator with zero values
function initializeCalculator() {
    document.getElementById('bill-value').value = '';
    document.getElementById('discount-range').value = 0;
    document.getElementById('discount-value').textContent = '0%';
    document.getElementById('monthly-economy').textContent = formatCurrency(0);
    document.getElementById('yearly-economy').textContent = formatCurrency(0);
    document.getElementById('saving-value').textContent = formatCurrency(0);
    document.getElementById('real-monthly-economy').textContent = formatCurrency(0);
    document.getElementById('real-yearly-economy').textContent = formatCurrency(0);
    document.getElementById('real-economy-5-years').textContent = formatCurrency(0);
    document.getElementById('first-payment').textContent = formatCurrency(0);
    document.getElementById('payment-formula').textContent = `${formatCurrency(0)} - ${formatCurrency(0)} = ${formatCurrency(0)}`;
}

// Initial calculation
initializeCalculator();
calculateResults();
