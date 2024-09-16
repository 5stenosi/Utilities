import { initializeDictionary, isValidWord, chooseRandomWord, getSecretWord } from './dictionary.js';

let validWords = [];
let word = '';

async function initializeGame() {
    await initializeDictionary(); // Assicurati che le parole siano caricate
    word = getSecretWord(); // Parola da indovinare

    console.log('Words for the game:', validWords); // Debug
    console.log('Secret Word in game.js:', word); // Debug

    initializeGrid();
    initializeKeyboard();
}

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

        if (letter === word[i]) {
            cell.classList.remove('bg-neutral-500'); // Rimuovi il colore grigio
            cell.classList.add('bg-green-500'); // Lettera nella posizione corretta
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
                cell.classList.remove('bg-neutral-500'); // Rimuovi il colore grigio
                cell.classList.add('bg-yellow-500'); // Lettera presente ma nella posizione sbagliata
                wordCopy[letterIndex] = null; // Rimuovi la lettera dalla copia della parola
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