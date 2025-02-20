document.addEventListener('DOMContentLoaded', function () {
    const contaReal = document.getElementById('conta-real');
    const desconto = document.getElementById('desconto');
    const saving = document.getElementById('saving');
    const economiaReal = document.getElementById('economia-real');
    const economiaAno = document.getElementById('economia-ano');
    const economiaPercentual = document.getElementById('economia-percentual');

    function calcularEconomia() {
        const valorConta = parseFloat(contaReal.value);
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

        economiaReal.textContent = `R$ ${valorEconomiaReal.toFixed(2)}`;
        economiaAno.textContent = `R$ ${valorEconomiaAno.toFixed(2)}`;
        economiaPercentual.textContent = `${percentualEconomia.toFixed(2)}%`;
    }

    contaReal.addEventListener('input', calcularEconomia);
    desconto.addEventListener('change', calcularEconomia);
    saving.addEventListener('change', calcularEconomia);
});
