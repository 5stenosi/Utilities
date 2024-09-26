import { initializeDictionary, isValidWord, chooseRandomWord, getSecretWord } from './dictionary.js';

let validWords = [];
let word = '';

const MAX_ATTEMPTS = 6; // Numero massimo di tentativi

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

async function initializeGame() {
    await initializeDictionary(); // Assicurati che le parole siano caricate
    word = getSecretWord(); // Parola da indovinare

    console.log('Words for the game:', validWords); // Debug
    console.log('Secret Word is:', word); // Debug

    initializeGrid();
    initializeKeyboard();
    addKeyboardEventListeners();
}

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

        // Controlla se il tema corrente è dark o light
        const isDarkMode = document.documentElement.classList.contains('dark');

        // Aggiungi la classe del colore in base al tema
        if (isDarkMode) {
            cell.classList.remove('bg-stone-400');
            cell.classList.add('bg-neutral-500'); // Colore per dark mode
        } else {
            cell.classList.remove('bg-neutral-500');
            cell.classList.add('bg-stone-400'); // Colore per light mode
        }

        cell.classList.add('animate-bounce'); // Animazione aggiunta

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

// Gestisci la pressione dei tasti della tastiera fisica
function addKeyboardEventListeners() {
    document.addEventListener('keydown', (e) => {
        const key = e.key.toUpperCase();
        if (key === 'ENTER') {
            e.preventDefault(); // Previene il comportamento predefinito del tasto "Enter"
            handleSpecialKeyPress('ENTER');
        } else if (isLetterKey(key)) {
            handleKeyPress(key);
        } else if (key === 'BACKSPACE') {
            handleSpecialKeyPress('BACKSPACE');
        }
    });
}

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

    guess = guess.toUpperCase(); // Assicurati che la parola inserita sia in maiuscolo

    if (!isValidWord(guess)) {
        alert('La parola non è valida!');
        return;
    }

    const wordCopy = word.split(''); // Copia la parola segreta in un array
    const verifiedLetters = Array(5).fill(false);

    // Prima passata: verifica le lettere nella posizione corretta
    for (let i = 0; i < 5; i++) {
        const cell = grid.children[currentRow * 5 + i];
        const letter = guess[i];

        // Rimuovi i colori precedenti prima di aggiungere i nuovi colori
        cell.classList.remove('bg-stone-400', 'bg-neutral-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500');

        if (letter === word[i]) {
            // Lettera nella posizione corretta
            cell.classList.add('bg-green-500');
            verifiedLetters[i] = true;
            wordCopy[i] = null; // Rimuovi la lettera dalla copia della parola
        }
    }

    // Seconda passata: verifica le lettere presenti ma nella posizione sbagliata
    for (let i = 0; i < 5; i++) {
        const cell = grid.children[currentRow * 5 + i];
        const letter = guess[i];

        if (!verifiedLetters[i]) {
            const letterIndex = wordCopy.indexOf(letter);

            if (letterIndex !== -1) {
                // Lettera presente ma nella posizione sbagliata
                cell.classList.add('bg-yellow-500');
                wordCopy[letterIndex] = null; // Rimuovi la lettera dalla copia della parola
            } else {
                // Lettera sbagliata
                cell.classList.add('bg-red-500');
                disableLetter(letter); // Disabilita la lettera
            }
        }
    }

    if (guess === word) {
        setTimeout(() => {
            alert('Hai indovinato!');
            resetGame(); // Resetta il gioco
        }, 500);
    } else {
        if (currentRow === MAX_ATTEMPTS - 1) {
            setTimeout(() => {
                alert('Hai perso! La parola era: ' + word);
                resetGame(); // Resetta il gioco
            }, 500);
        } else {
            alert('Riprova!');
        }
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
        cell.classList.remove('bg-stone-400', 'animate-bounce');

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
    word = chooseRandomWord(validWords).toUpperCase(); // Scegli una nuova parola segreta
    console.log('New Secret Word:', word); // Debug

    // Svuota la griglia
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }

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

    initializeGame();
}

initializeGame();