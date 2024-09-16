let validWords = [];
let secretWord = '';

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

function chooseRandomWord(words) {
    if (words.length === 0) {
        console.error('No words available');
        return '';
    }
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

async function initializeDictionary() {
    validWords = await fetchWords();
    validWords = validWords.map(word => word.toUpperCase()); // Trasforma tutte le parole in maiuscolo
    validWords.sort(); // Ordina l'array in ordine alfabetico
    console.log('Valid Words (sorted):', validWords); // Debug
    secretWord = chooseRandomWord(validWords);
    console.log('Secret Word:', secretWord); // Debug
}

// Aggiungi una funzione getter per secretWord
function getSecretWord() {
    return secretWord;
}

function isValidWord(word) {
    return validWords.includes(word.toUpperCase());
}



export { initializeDictionary, isValidWord, chooseRandomWord, getSecretWord };