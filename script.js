document.addEventListener('DOMContentLoaded', function () {
    const contaReal = document.getElementById('conta-real');
    const desconto = document.getElementById('desconto');
    const saving = document.getElementById('saving');
    const savingValue = document.getElementById('saving-value');
    const economiaReal = document.getElementById('economia-real');
    const economiaAno = document.getElementById('economia-ano');
    const economiaPercentual = document.getElementById('economia-percentual');

    // Formatação de moeda brasileira
    function formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    // Função para calcular a economia
    function calcularEconomia() {
        const valorConta = parseFloat(contaReal.value.replace(/[^0-9,-]/g, '').replace(',', '.'));
        const percentualDesconto = parseFloat(desconto.value);
        const percentualSaving = parseFloat(saving.value);

        if (isNaN(valorConta)) {
            alert('Por favor, insira um valor válido para a conta de água.');
            return;
        }

        const valorDesconto = valorConta * (percentualDesconto / 100);
        const valorSaving = valorDesconto * (percentualSaving / 100);
        const valorEconomiaReal = valorDesconto - valorSaving;
        const valorEconomiaAno = valorEconomiaReal * 12;
        const percentualEconomia = (valorEconomiaReal / valorConta) * 100;

        // Atualiza os valores na tela
        savingValue.textContent = formatarMoeda(valorSaving);
        economiaReal.textContent = formatarMoeda(valorEconomiaReal);
        economiaAno.textContent = formatarMoeda(valorEconomiaAno);
        economiaPercentual.textContent = `${percentualEconomia.toFixed(2)}%`;
    }

    // Formata o campo de entrada para moeda brasileira
    contaReal.addEventListener('input', function () {
        let valor = contaReal.value.replace(/[^0-9]/g, '');
        valor = (Number(valor) / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        contaReal.value = valor;
        calcularEconomia();
    });

    // Atualiza os cálculos ao mudar os selects
    desconto.addEventListener('change', calcularEconomia);
    saving.addEventListener('change', calcularEconomia);

    // Calcula os valores iniciais ao carregar a página
    calcularEconomia();
});
