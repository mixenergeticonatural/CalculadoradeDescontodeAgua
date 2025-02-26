let currentType = 'residential';
let currentSaving = 22; // Valor inicial do Saving
let annualChart = null;
let fiveYearChart = null;

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
    
    // Atualiza os dados dos gráficos
    updateChartData(realMonthlyEconomy);
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

// Modais de gráficos
const annualChartModal = document.getElementById('annual-chart-modal');
const fiveYearChartModal = document.getElementById('five-year-chart-modal');
const showAnnualChartButton = document.getElementById('show-annual-chart');
const showFiveYearChartButton = document.getElementById('show-five-year-chart');
const closeAnnualChartButton = document.querySelector('.annual-chart-close');
const closeFiveYearChartButton = document.querySelector('.five-year-chart-close');

showAnnualChartButton.addEventListener('click', function() {
    annualChartModal.style.display = 'block';
    if (annualChart) {
        annualChart.update();
    }
});

showFiveYearChartButton.addEventListener('click', function() {
    fiveYearChartModal.style.display = 'block';
    if (fiveYearChart) {
        fiveYearChart.update();
    }
});

closeAnnualChartButton.addEventListener('click', function() {
    annualChartModal.style.display = 'none';
});

closeFiveYearChartButton.addEventListener('click', function() {
    fiveYearChartModal.style.display = 'none';
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
    if (e.target === annualChartModal) {
        annualChartModal.style.display = 'none';
    }
    if (e.target === fiveYearChartModal) {
        fiveYearChartModal.style.display = 'none';
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

// Função para criar e atualizar os gráficos
function updateChartData(monthlyValue) {
    // Gráfico mensal (12 meses)
    const currentDate = new Date();
    const monthLabels = [];
    const monthlyData = [];
    let accumulatedValue = 0;
    
    for (let i = 0; i < 12; i++) {
        const month = new Date(currentDate);
        month.setMonth(currentDate.getMonth() + i);
        monthLabels.push(month.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        
        accumulatedValue += monthlyValue;
        monthlyData.push(accumulatedValue);
    }
    
    // Gráfico semestral (5 anos)
    const semesterLabels = [];
    const semesterData = [];
    accumulatedValue = 0;
    
    for (let i = 0; i < 10; i++) {
        const semester = new Date(currentDate);
        semester.setMonth(currentDate.getMonth() + i * 6);
        semesterLabels.push(semester.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        
        accumulatedValue += monthlyValue * 6;
        semesterData.push(accumulatedValue);
    }
    
    // Cria ou atualiza o gráfico anual
    const annualChartCtx = document.getElementById('annual-chart').getContext('2d');
    if (annualChart) {
        annualChart.data.labels = monthLabels;
        annualChart.data.datasets[0].data = monthlyData;
        annualChart.update();
    } else {
        annualChart = new Chart(annualChartCtx, {
            type: 'bar',
            data: {
                labels: monthLabels,
                datasets: [{
                    label: 'Economia Acumulada (R$)',
                    data: monthlyData,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Cria ou atualiza o gráfico de 5 anos
    const fiveYearChartCtx = document.getElementById('five-year-chart').getContext('2d');
    if (fiveYearChart) {
        fiveYearChart.data.labels = semesterLabels;
        fiveYearChart.data.datasets[0].data = semesterData;
        fiveYearChart.update();
    } else {
        fiveYearChart = new Chart(fiveYearChartCtx, {
            type: 'line',
            data: {
                labels: semesterLabels,
                datasets: [{
                    label: 'Economia Acumulada (R$)',
                    data: semesterData,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Inicializa a calculadora
calculateResults();
