let currentDiscount = 50;
let currentSaving = 22;

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function setDiscount(value) {
    currentDiscount = value;
    document.querySelectorAll('[data-value]').forEach(button => {
        if (button.dataset.value == value && button.parentElement.previousElementSibling.textContent === 'Desconto') {
            button.classList.add('selected');
        } else if (button.parentElement.previousElementSibling.textContent === 'Desconto') {
            button.classList.remove('selected');
        }
    });
    calculateResults();
}

function setSaving(value) {
    currentSaving = value;
    document.querySelectorAll('[data-value]').forEach(button => {
        if (button.dataset.value == value && button.parentElement.previousElementSibling.textContent === 'Saving') {
            button.classList.add('selected');
        } else if (button.parentElement.previousElementSibling.textContent === 'Saving') {
            button.classList.remove('selected');
        }
    });
    calculateResults();
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

// Initial calculation
calculateResults();
