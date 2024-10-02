let validWords = [];
let secretWord = '';

// Funzione per fetchare le parole dall'API
async function fetchWords() {
    try {
        const response = await fetch('https://word-generator2.p.rapidapi.com/?length=5&count=9000', {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'word-generator2.p.rapidapi.com',
                'x-rapidapi-key': 'ab1d528845mshada179191771720p1b4f2ejsn014e86606331'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('API Response:', data); // Debug
        
        // Supponiamo che la risposta contenga un array di parole
        const words = data.body || [];
        return words;
    } catch (error) {
        console.error('Error fetching words:', error);
        return [];
    }
}

// Funzione per scegliere una parola casuale dall'array di parole
export function chooseRandomWord(words) {
    if (words.length === 0) {
        return '';
    }
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

// Funzione per inizializzare il dizionario
export async function initializeDictionary() {
    validWords = await fetchWords();
    validWords = validWords.map(word => word.toUpperCase()); // Trasforma tutte le parole in maiuscolo
    validWords.sort(); // Ordina l'array in ordine alfabetico
    console.log('Valid Words (sorted):', validWords); // Debug
    secretWord = chooseRandomWord(validWords);
    console.log('Secret Word:', secretWord); // Debug
}

// Funzione getter per ottenere la parola segreta
export function getSecretWord() {
    return secretWord;
}

// Funzione per verificare se una parola è valida
export function isValidWord(word) {
    return validWords.includes(word.toUpperCase());
}

// DEFINITION // DEFINITION // DEFINITION // DEFINITION // DEFINITION // DEFINITION // DEFINITION 

// Funzione per ottenere la definizione di una parola
export async function fetchWordDefinition(word) {
    const url = `https://dictionary-by-api-ninjas.p.rapidapi.com/v1/dictionary?word=${word}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'ab1d528845mshada179191771720p1b4f2ejsn014e86606331',
            'x-rapidapi-host': 'dictionary-by-api-ninjas.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json(); // Assicurati che il risultato sia un oggetto JSON

        if (result.definition) {
            // Cerca il numero "2." nella definizione e taglia il testo prima di esso
            const definition = result.definition;
            const indexOfSecondDefinition = definition.indexOf('2.');
            
            // Se "2." viene trovato, taglia la stringa fino a quel punto, altrimenti restituisci tutta la definizione
            if (indexOfSecondDefinition !== -1) {
                return definition.slice(0, indexOfSecondDefinition).trim();
            } else {
                return definition.trim(); // Restituisce la definizione completa se non esiste una seconda definizione
            }
        } else {
            return 'Definizione non trovata';
        }
    } catch (error) {
        console.error(error);
        return 'Errore durante il recupero della definizione';
    }
}

// Funzione per mostrare il messaggio finale con la definizione
export async function showFinalAlert() {
    const definition = await fetchWordDefinition(secretWord.toLowerCase());
    alert(`La parola segreta era: ${secretWord}\nDefinizione: ${definition}`);
}