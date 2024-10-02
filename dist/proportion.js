document.addEventListener('DOMContentLoaded', function () {
    const numberInputs = document.querySelectorAll('input[type="number"]');

    numberInputs.forEach(input => {
        input.addEventListener('input', function () {
            this.value = this.value.replace(/e/gi, '');
        });
    });
});

// Funzione per calcolare il valore mancante
function calculateProportion() {
    const valueA = parseFloat(document.getElementById('value-a').value);
    const valueB = parseFloat(document.getElementById('value-b').value);
    const valueC = parseFloat(document.getElementById('value-c').value);
    const valueD = parseFloat(document.getElementById('value-d').value);
    const errorMsg = document.getElementById('error-msg'); // Elemento per i messaggi di errore

    errorMsg.textContent = ''; // Resetta il messaggio di errore

    let filledInputs = 0;

    // Conta quanti valori sono stati riempiti
    if (!isNaN(valueA)) filledInputs++;
    if (!isNaN(valueB)) filledInputs++;
    if (!isNaN(valueC)) filledInputs++;
    if (!isNaN(valueD)) filledInputs++;

    // Se esattamente 3 valori sono riempiti, calcola il quarto
    if (filledInputs === 3) {
        if (isNaN(valueA)) {
            document.getElementById('value-a').value = (valueC * valueB) / valueD || '';
        } else if (isNaN(valueB)) {
            document.getElementById('value-b').value = (valueA * valueD) / valueC || '';
        } else if (isNaN(valueC)) {
            document.getElementById('value-c').value = (valueA * valueD) / valueB || '';
        } else if (isNaN(valueD)) {
            document.getElementById('value-d').value = (valueC * valueB) / valueA || '';
        }
    } else {
        errorMsg.textContent = "Riempi esattamente 3 valori per calcolare la proporzione.";
    }
}

// Aggiunge un listener al bottone per eseguire il calcolo quando viene premuto
document.getElementById('calculate-btn').addEventListener('click', function () {
    // Pulisce eventuali risultati precedenti
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.readOnly = false; // Rende nuovamente editabili gli input
    });
    calculateProportion();
});

document.getElementById('reset-btn').addEventListener('click', function () {
    // Pulisce i valori di tutti gli input
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
        input.readOnly = false; // Rende nuovamente editabili gli input
    });

    // Pulisce il messaggio di errore
    document.getElementById('error-msg').textContent = '';
});