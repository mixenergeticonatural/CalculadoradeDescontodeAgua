let currentDiscount = 50;
let currentSaving = 22;

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

    document.getElementById('monthly-economy').textContent = formatCurrency(monthlyEconomy);
    document.getElementById('yearly-economy').textContent = formatCurrency(yearlyEconomy);
    document.getElementById('saving-value').textContent = formatCurrency(savingValue);
    document.getElementById('real-monthly-economy').textContent = formatCurrency(realMonthlyEconomy);
    document.getElementById('real-yearly-economy').textContent = formatCurrency(realYearlyEconomy);
    document.getElementById('real-economy-percentage').textContent = `${realEconomyPercentage.toFixed(2)}%`;
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
