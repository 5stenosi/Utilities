const word = "STENO"; // Parola da indovinare
let currentRow = 0;
let currentCol = 0;
let disabledLetters = [];

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
        keyElement.classList.remove('w-9', 'h-9', 'sm:w-14', 'sm:h-14');
        keyElement.classList.add('w-16', 'sm:w-20');
    } else {
        keyElement.addEventListener('click', () => handleKeyPress(key));
    }

    row.appendChild(keyClone);
}

// Gestisce la pressione di un tasto
function handleKeyPress(key) {
    if (currentCol < 5 && !disabledLetters.includes(key)) {
        const cell = grid.children[currentRow * 5 + currentCol];
        cell.textContent = key;
        // Cambia lo sfondo quando viene inserita una lettera
        cell.classList.add('bg-neutral-500');
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
    if (isLetterKey(key) && !disabledLetters.includes(key)) {
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
    if (currentCol === 5) {
        let guess = '';
        for (let i = 0; i < 5; i++) {
            guess += grid.children[currentRow * 5 + i].textContent;
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
            alert('Hai indovinato!');
        } else {
            alert('Riprova!');
        }
        currentRow++;
        currentCol = 0;
    }
}

// Funzione per disabilitare una lettera
function disableLetter(letter) {
    if (!disabledLetters.includes(letter)) {
        disabledLetters.push(letter);
        const keyElements = document.querySelectorAll('.key');
        keyElements.forEach(keyElement => {
            if (keyElement.textContent === letter) {
                keyElement.classList.add('brightness-50', 'cursor-default'); // Cambia il colore dello sfondo
                keyElement.classList.remove('hover:bg-neutral-500', 'hover:scale-110'); // Rimuovi l'effetto hover
                keyElement.classList.add('disabled'); // Aggiungi una classe per disabilitare il tasto
                keyElement.removeEventListener('click', handleKeyPress);
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
        cell.classList.remove('bg-neutral-500');
    }
}

// Inizializza la griglia e la tastiera
initializeGrid();
initializeKeyboard();