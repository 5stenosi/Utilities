// Parole da indovinare
const words = [
    "KAYAK",
    "TOKYO",
    "KENYA",
    "WATER", "TEXAS", "KOALA", "EXTRA", "AEREO", "AEREI", "AEREE", "AEREA",
    "ARATO", "ARATI", "ARATE", "ARATA", "ARARE", "AORTA", "ACETO", "ACETI", "ACERO", "ACARO",
    "ALICI", "ALICE", "ALIAS", "ALATO", "ALATE", "ALARE", "AIUTO", "AIUTI", "AIUTA", "ACINO",
    "ALTRO", "ALTRI", "ALTRE", "ALTRA", "ALONE", "ALANO", "ALANI", "ACUTO", "ACUTI", "ACUTA",
    "ACIDE", "ACIDA", "ABITO", "ABITI", "ABITA", "ABETI", "ABETE", "ABATI", "ABATE", "ABACO",
    "AFONI", "AFONE", "AFONA", "ADONE", "ADAMO", "ABILI", "ABILE",
    "ARDUI", "ARDUE", "ARDUA", "AMBRA", "ALCUN", "ABUSO", "ABUSI", "ABUSA",
    "AGATA", "ADDIO", "ABBIA", "ABBAI",
    "BARDO", "BARDI", "BARBE", "BARBA", "ARCHI", "ALZAI", "AHIME", "AGLIO", "AGILI", "AGILE",
    "BELVE", "BELVA", "BANDO", "BANDI", "BANDE", "BANDA", "BALDO", "ANCHE", "ALBUM",
    "DAZIO", "BEIGE", "AGIVO", "AGIVI", "AGIVA", "AGAVE", "ADIGE", "ADAGI",
    "BEFFE", "BEFFA", "BAZAR", "BAFFO", "BAFFI", "BACHI", "BABBO", "BABBI", "ACQUE", "ACQUA",
    "BELGI", "BELGA", "BALZO", "BALZI", "BALZE", "BALZA", "BAGNO", "BAGNI", "BAGNA",
    "BUFFO", "BUFFI", "BUFFE", "BUFFA", "BUCHI", "BUCHE", "BLITZ",
    "GARZA", "GAFFE", "FUNGO", "FUNGE", "COZZO", "COZZI", "COZZE", "COZZA", "COZZO",
    "LEGGE", "LEGGA", "LAGHI", "GOGNA", "GIGLI", "GHANA", "GANGE", "BLUFF", "ALGHE",
    "ZUPPO", "ZUPPE", "ZUPPA", "RUGHE", "LIGHT",
    "PAGHI", "PAGGI", "FAGGI", "DIGHE", "BOZZO", "BOZZE", "BOZZA",
    "PUZZO", "PUZZI", "PUZZA", "FUGHE", "FUGGI", "FUGGE", "FUGGA",
    "GOZZO", "GAZZA",
];

// Funzione per selezionare una parola casuale
function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

// Variabile per la parola da indovinare
let word = getRandomWord(); // Parola da indovinare

let currentRow = 0;
let currentCol = 0;
let disabledLetters = [];
let animatedCells = [];

const grid = document.getElementById('grid');
const cellTemplate = document.getElementById('grid-cell-template');
const keyTemplate = document.getElementById('keyboard-key-template');
const row1 = document.getElementById('row1');
const row2 = document.getElementById('row2');
const row3 = document.getElementById('row3');

// Funzione per inizializzare la griglia
function initializeGrid() {
    for (let i = 0; i < 30; i++) {
        const cell = document.importNode(cellTemplate.content, true);
        grid.appendChild(cell);
    }
}

// Funzione per inizializzare la tastiera
function initializeKeyboard() {
    const keysRow1 = 'QWERTYUIOP'.split('');
    const keysRow2 = 'ASDFGHJKL'.split('');
    const keysRow3 = ['ENTER', ...'ZXCVBNM'.split(''), 'BACKSPACE'];

    keysRow1.forEach(key => createKey(key, row1));
    keysRow2.forEach(key => createKey(key, row2));
    keysRow3.forEach(key => createKey(key, row3));
}

function createKey(key, row) {
    const keyClone = document.importNode(keyTemplate.content, true);
    const keyElement = keyClone.querySelector('.key');

    if (key === 'BACKSPACE') {
        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-backspace'); // Classe per l'icona di backspace di Font Awesome
        keyElement.appendChild(icon);
    } else {
        keyElement.textContent = key;
    }

    if (key === 'ENTER' || key === 'BACKSPACE') {
        keyElement.classList.add('special-key');
        keyElement.addEventListener('click', () => handleSpecialKeyPress(key));

        // Rimuovi la larghezza predefinita e aggiungi una nuova classe di larghezza con Tailwind CSS
        keyElement.classList.remove('w-7', 'h-7', 'sm:w-14', 'sm:h-14');
        keyElement.classList.add('w-14', 'sm:w-20');
    } else {
        keyElement.addEventListener('click', () => handleKeyPress(key));
    }

    row.appendChild(keyClone);
}

// Gestisce la pressione di un tasto
function handleKeyPress(key) {
    if (currentCol < 5) {
        const cell = grid.children[currentRow * 5 + currentCol];
        cell.textContent = key;
        // Cambia lo sfondo quando viene inserita una lettera
        cell.classList.add('bg-neutral-500', 'animate-bounce');

        // Aggiungi la cella all'array delle celle animate
        animatedCells.push(cell);

        currentCol++;
    }
}

// Gestisce la pressione di un tasto speciale
function handleSpecialKeyPress(key) {
    if (key === 'ENTER') {
        checkWord();
    } else if (key === 'BACKSPACE') {
        deleteLetter();
    }
}

// Gestisce la pressione dei tasti della tastiera fisica
document.addEventListener('keydown', (e) => {
    const key = e.key.toUpperCase();
    if (isLetterKey(key)) {
        handleKeyPress(key);
    } else {
        handleSpecialKeyPress(key);
    }
});

// Verifica se il tasto premuto è una lettera
function isLetterKey(key) {
    const keysRow1 = 'QWERTYUIOP'.split('');
    const keysRow2 = 'ASDFGHJKL'.split('');
    const keysRow3 = 'ZXCVBNM'.split('');
    return keysRow1.includes(key) || keysRow2.includes(key) || keysRow3.includes(key);
}

// Controlla se la parola inserita è corretta
function checkWord() {
    if (currentCol !== 5) {
        // Mostra un messaggio di avviso
        alert('Completa la parola prima di premere invio!');
        return;
    }

    let guess = '';
    for (let i = 0; i < 5; i++) {
        guess += grid.children[currentRow * 5 + i].textContent;
    }

    // Controlla se la parola inserita è valida
    if (!words.includes(guess)) {
        alert('La parola non è valida!');
        return;
    }

    const verifiedLetters = Array(5).fill(false);

    // Prima passata: verifica le lettere nella posizione corretta
    for (let i = 0; i < 5; i++) {
        const cell = grid.children[currentRow * 5 + i];
        const letter = guess[i];

        if (letter === word[i]) {
            cell.classList.add('bg-green-500'); // Lettera nella posizione corretta
            verifiedLetters[i] = true;
        }
    }

    // Seconda passata: verifica le lettere presenti ma nella posizione sbagliata
    for (let i = 0; i < 5; i++) {
        const cell = grid.children[currentRow * 5 + i];
        const letter = guess[i];

        if (!verifiedLetters[i]) {
            if (word.includes(letter)) {
                let countInWord = 0;
                let countInGuess = 0;

                // Conta quante volte la lettera appare nella parola
                for (let j = 0; j < 5; j++) {
                    if (word[j] === letter) {
                        countInWord++;
                    }
                }

                // Conta quante volte la lettera appare nella guess fino alla posizione corrente
                for (let j = 0; j <= i; j++) {
                    if (guess[j] === letter) {
                        countInGuess++;
                    }
                }

                // Se la lettera appare più volte nella guess rispetto alla parola, non cambiare il colore
                if (countInGuess <= countInWord) {
                    cell.classList.add('bg-yellow-500'); // Lettera presente ma nella posizione sbagliata
                }
            } else {
                cell.classList.add('bg-red-500'); // Lettera sbagliata
                disableLetter(letter); // Disabilita la lettera
            }
        }
    }

    if (guess === word) {
        // Rimuovi l'animazione dalle celle dopo che la parola è stata controllata
        animatedCells.forEach(cell => {
            cell.classList.remove('animate-bounce');
        });

        // Svuota l'array delle celle animate
        animatedCells = [];

        // Aggiungi un ritardo di 500ms prima di mostrare l'avviso di vittoria
        setTimeout(() => {
            alert('Hai indovinato!');
            resetGame(); // Resetta il gioco
        }, 500);
    } else {
        alert('Riprova!');
    }
    currentRow++;
    currentCol = 0;

    // Rimuovi l'animazione dalle celle dopo che la parola è stata controllata
    animatedCells.forEach(cell => {
        cell.classList.remove('animate-bounce');
    });

    // Svuota l'array delle celle animate
    animatedCells = [];
}

// Funzione per disabilitare una lettera
function disableLetter(letter) {
    if (!disabledLetters.includes(letter)) {
        disabledLetters.push(letter);
        const keyElements = document.querySelectorAll('.key');
        keyElements.forEach(keyElement => {
            if (keyElement.textContent === letter) {
                keyElement.classList.add('brightness-50'); // Cambia il colore dello sfondo
                keyElement.classList.remove('hover:bg-neutral-500', 'hover:scale-110'); // Rimuovi l'effetto hover
            }
        });
    }
}

// Funzione per cancellare una lettera
function deleteLetter() {
    if (currentCol > 0) {
        currentCol--;
        const cell = grid.children[currentRow * 5 + currentCol];
        cell.textContent = '';
        // Ripristina lo sfondo predefinito quando la cella è vuota
        cell.classList.remove('bg-neutral-500', 'animate-bounce');

        // Rimuovi la cella dall'array delle celle animate
        const index = animatedCells.indexOf(cell);
        if (index > -1) {
            animatedCells.splice(index, 1);
        }
    }
}

// Funzione per resettare il gioco
function resetGame() {
    currentRow = 0;
    currentCol = 0;
    disabledLetters = [];
    word = getRandomWord(); // Scegli una nuova parola casuale

    // Svuota la griglia
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
    initializeGrid();

    // Svuota la tastiera
    while (row1.firstChild) {
        row1.removeChild(row1.firstChild);
    }
    while (row2.firstChild) {
        row2.removeChild(row2.firstChild);
    }
    while (row3.firstChild) {
        row3.removeChild(row3.firstChild);
    }
    initializeKeyboard();
}

// Inizializza la griglia e la tastiera
initializeGrid();
initializeKeyboard();