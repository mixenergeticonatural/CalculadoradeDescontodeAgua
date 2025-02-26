let currentType = 'residential';
let currentSaving = 22; // Valor inicial do Saving

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function formatPercentage(value) {
    return `${value.toFixed(1)}%`;
}

function calculateResults() {
    const billInput = document.getElementById('bill-value');
    const discountRange = document.getElementById('discount-range');
    const billValue = parseFloat(billInput.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    const discountPercentage = parseInt(discountRange.value);

    const monthlyEconomy = (billValue * discountPercentage) / 100;
    const yearlyEconomy = monthlyEconomy * 12;
    const savingValue = (monthlyEconomy * currentSaving) / 100; // Usando currentSaving
    const realMonthlyEconomy = monthlyEconomy - savingValue;
    const realYearlyEconomy = realMonthlyEconomy * 12;
    const realEconomyIn5Years = realYearlyEconomy * 5;

    // Calcula a porcentagem real de desconto
    const realDiscountPercentage = billValue > 0 ? (realMonthlyEconomy / billValue) * 100 : 0;

    // Calcula o valor da nova fatura com desconto
    const newBillValue = billValue > 0 ? billValue - realMonthlyEconomy : 0;

    // Calcula quantas faturas economizadas por ano (arredondando para baixo)
    const billSavingsCount = newBillValue > 0 ? Math.floor(realYearlyEconomy / newBillValue * 10) / 10 : 0;

    const isResidential = currentType === 'residential';
    const totalInstallation = isResidential ? 195.00 : 390.00;
    const installmentValue = isResidential ? 38.99 : 48.75;
    const installments = isResidential ? 5 : 8;

    // Atualiza os valores na interface
    document.getElementById('installation-value').textContent = formatCurrency(totalInstallation);
    document.getElementById('installation-total').textContent = 
        `${installments}x de ${formatCurrency(installmentValue)}`;

    document.getElementById('monthly-economy').textContent = formatCurrency(monthlyEconomy);
    document.getElementById('yearly-economy').textContent = formatCurrency(yearlyEconomy);
    document.getElementById('saving-value').textContent = formatCurrency(savingValue);
    document.getElementById('real-monthly-economy').textContent = formatCurrency(realMonthlyEconomy);
    document.getElementById('real-yearly-economy').textContent = formatCurrency(realYearlyEconomy);
    document.getElementById('real-economy-5-years').textContent = formatCurrency(realEconomyIn5Years);
    document.getElementById('real-discount-percentage').textContent = formatPercentage(realDiscountPercentage);
    document.getElementById('new-bill-value').textContent = formatCurrency(newBillValue);

    // Atualiza os valores do modal da fatura
    document.getElementById('bill-discount-value').textContent = formatCurrency(newBillValue);
    
    // Armazena o valor de faturas economizadas para uso na animação
    document.getElementById('bill-savings-count').dataset.value = billSavingsCount.toFixed(1);
    
    // Atualiza a data de previsão (data atual + 30 dias)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const formattedDate = futureDate.toLocaleDateString('pt-BR');
    document.getElementById('bill-date').textContent = formattedDate;

    const balance = realMonthlyEconomy - totalInstallation;
    document.getElementById('first-payment').textContent = formatCurrency(balance);
    document.getElementById('payment-formula').textContent = 
        `${formatCurrency(realMonthlyEconomy)} - ${formatCurrency(totalInstallation)} = ${formatCurrency(balance)}`;

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

// Formata o valor da fatura como moeda
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

// Seleção de tipo (residencial/comercial)
const typeButtons = document.querySelectorAll('.type-button');
typeButtons.forEach(button => {
    button.addEventListener('click', function() {
        typeButtons.forEach(btn => btn.classList.remove('selected'));
        this.classList.add('selected');
        currentType = this.dataset.type;
        calculateResults();
    });
});

// Atualiza o valor do desconto
const discountRange = document.getElementById('discount-range');
const discountValue = document.getElementById('discount-value');

discountRange.addEventListener('input', function() {
    discountValue.textContent = `${this.value}%`;
    calculateResults();
});

// Botão Saving
const savingButton = document.getElementById('saving-button');
const savingOptions = document.getElementById('saving-options');

savingButton.addEventListener('dblclick', function() {
    savingOptions.classList.toggle('hidden');
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

// Modal da fatura
const billModal = document.getElementById('bill-modal');
const showBillButton = document.getElementById('show-bill-button');
const closeBillButton = document.querySelector('.close-button');

showBillButton.addEventListener('click', function() {
    billModal.style.display = 'block';
    
    // Inicia a animação de contagem
    const billSavingsCount = document.getElementById('bill-savings-count');
    const targetValue = parseFloat(billSavingsCount.dataset.value) || 0;
    animateCounter(0, targetValue, 1500, billSavingsCount);
    
    // Anima a barra de progresso
    setTimeout(() => {
        document.getElementById('savings-progress').style.width = '100%';
    }, 300);
});

closeBillButton.addEventListener('click', function() {
    billModal.style.display = 'none';
    // Reseta a barra de progresso
    document.getElementById('savings-progress').style.width = '0%';
});

// Modal de benefícios
const benefitsModal = document.getElementById('benefits-modal');
const showBenefitsButton = document.getElementById('show-benefits-button');
const closeBenefitsButton = document.querySelector('.benefits-close');

showBenefitsButton.addEventListener('click', function() {
    benefitsModal.style.display = 'block';
});

closeBenefitsButton.addEventListener('click', function() {
    benefitsModal.style.display = 'none';
});

// Fecha os modais ao clicar fora deles
window.addEventListener('click', function(e) {
    if (e.target === billModal) {
        billModal.style.display = 'none';
        document.getElementById('savings-progress').style.width = '0%';
    }
    if (e.target === benefitsModal) {
        benefitsModal.style.display = 'none';
    }
});

// Função para animar a contagem
function animateCounter(start, end, duration, element) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = progress * (end - start) + start;
        element.textContent = value.toFixed(1);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Inicializa a calculadora
function initializeCalculator() {
    document.getElementById('bill-value').value = '';
    document.getElementById('discount-range').value = 50;
    document.getElementById('discount-value').textContent = '50%';
    document.getElementById('monthly-economy').textContent = formatCurrency(0);
    document.getElementById('yearly-economy').textContent = formatCurrency(0);
    document.getElementById('saving-value').textContent = formatCurrency(0);
    document.getElementById('real-monthly-economy').textContent = formatCurrency(0);
    document.getElementById('real-yearly-economy').textContent = formatCurrency(0);
    document.getElementById('real-economy-5-years').textContent = formatCurrency(0);
    document.getElementById('real-discount-percentage').textContent = formatPercentage(0);
    document.getElementById('first-payment').textContent = formatCurrency(0);
    document.getElementById('payment-formula').textContent = `${formatCurrency(0)} - ${formatCurrency(0)} = ${formatCurrency(0)}`;
    document.getElementById('new-bill-value').textContent = formatCurrency(0);
    document.getElementById('bill-savings-count').textContent = "0";
    document.getElementById('bill-savings-count').dataset.value = "0";
}

initializeCalculator();
calculateResults();
