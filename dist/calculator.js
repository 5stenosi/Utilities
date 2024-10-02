// Selezioniamo gli elementi HTML
const resultDisplay = document.getElementById("result");
const calculationDisplay = document.getElementById("calculation");

// Variabili per memorizzare il calcolo e il risultato
let currentCalculation = "";
let currentResult = "";

// Mappa delle icone di FontAwesome e i rispettivi valori
const iconMap = {
    'fa-0': '0',
    'fa-1': '1',
    'fa-2': '2',
    'fa-3': '3',
    'fa-4': '4',
    'fa-5': '5',
    'fa-6': '6',
    'fa-7': '7',
    'fa-8': '8',
    'fa-9': '9',
    'fa-divide': '/',
    'fa-multiply': '*',
    'fa-minus': '-',
    'fa-plus': '+',
    'fa-percent': '%',
    'fa-circle': ',',  // Per il decimale
    'fa-backspace': 'delete',
    'fa-c': 'clear',
    'fa-equals': 'equals'
};

// Mappa dei tasti della tastiera e i rispettivi valori
const keyMap = {
    '0': '0',
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '/': '/',
    '*': '*',
    '-': '-',
    '+': '+',
    '%': '%',
    '.': ',',
    ',': ',',
    'Backspace': 'delete',
    'c': 'clear',
    'Enter': 'equals'
};

// Funzione per aggiornare il display del risultato
function updateResultDisplay(value) {
    resultDisplay.innerText = value;
}

// Funzione per aggiornare il display del calcolo
function updateCalculationDisplay(value) {
    calculationDisplay.innerText = value;
}

// Aggiungi eventi a tutti i bottoni
const buttons = document.querySelectorAll("button");
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const iconClass = button.querySelector('i').classList[1]; // Ottiene la classe dell'icona

        // Traduci l'icona nel valore corrispondente tramite la mappa
        const value = iconMap[iconClass];

        if (value) {
            handleInput(value);
        }
    });
});

// Aggiungi evento per i tasti della tastiera
document.addEventListener("keydown", (event) => {
    const value = keyMap[event.key];
    if (value) {
        handleInput(value);
    }
});

// Gestisci l'input sia dai bottoni che dalla tastiera
function handleInput(value) {
    // Gestione dei tasti speciali come uguale, cancella ecc.
    switch (value) {
        case 'equals':
            calculate();
            break;
        case 'delete':
            currentCalculation = currentCalculation.slice(0, -1);
            updateResultDisplay(currentCalculation);
            break;
        case 'clear':
            clearCalculation();
            break;
        default: // Numeri e operatori
            addToCalculation(value);
            break;
    }
}

// Aggiungi il valore al calcolo
function addToCalculation(value) {
    // Controlla se il valore è un punto decimale
    if (value === ',') {
        // Se il calcolo corrente contiene già un punto decimale, non aggiungere un altro punto
        if (currentCalculation.includes(',')) {
            return;
        }
    }
    currentCalculation += value;
    updateResultDisplay(currentCalculation); // Aggiorna il display del risultato
}

// Funzione per cancellare il calcolo
function clearCalculation() {
    currentCalculation = "";
    currentResult = "";
    updateResultDisplay("");
    updateCalculationDisplay("");
}

// Funzione per eseguire il calcolo
function calculate() {
    try {
        // Esegui il calcolo e salva il risultato
        currentResult = eval(currentCalculation); // ATTENZIONE: 'eval' deve essere usato con cautela
        updateCalculationDisplay(currentCalculation); // Mostra il calcolo completo
        updateResultDisplay(currentResult); // Mostra il risultato
        currentCalculation = ""; // Resetta il calcolo
    } catch (error) {
        updateResultDisplay("Error");
    }
}