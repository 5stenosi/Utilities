// Seleziona gli elementi
const notesGroup = document.getElementById('notes-group');
const whiteboard = document.getElementById('whiteboard');
const newNoteButton = document.getElementById('new-note');
const colorButtons = document.querySelectorAll('#red, #orange, #yellow, #green, #blue, #purple');

// Mappa dei colori ai rispettivi ID dei template
const colorToTemplate = {
    'bg-red-500': 'note-template-red',
    'bg-orange-500': 'note-template-orange',
    'bg-yellow-500': 'note-template-yellow',
    'bg-green-500': 'note-template-green',
    'bg-blue-500': 'note-template-blue',
    'bg-purple-500': 'note-template-purple'
};

// Variabile globale per tenere traccia del z-index massimo
let maxZIndex = 20;

// Margine di tolleranza per permettere alle note di uscire dai margini della whiteboard
const marginTolerance = 25;

// Variabile globale per il colore selezionato
let selectedColor = 'bg-yellow-500';

// Funzione per creare una nuova nota
function createNewNote() {
    const templateId = colorToTemplate[selectedColor]; // Ottieni l'ID del template in base al colore selezionato
    const noteTemplate = document.getElementById(templateId); // Seleziona il template corretto
    const newNote = noteTemplate.content.cloneNode(true); // Clona il contenuto del template
    const noteElement = newNote.querySelector('div'); // Seleziona il div della nuova nota
    const noteId = Date.now(); // Genera un ID unico basato sul timestamp
    noteElement.dataset.id = noteId; // Assegna l'ID alla nota

    // Ottieni le dimensioni della whiteboard
    const whiteboardRect = whiteboard.getBoundingClientRect();
    const noteWidth = 200; // Larghezza stimata della nota
    const noteHeight = 150; // Altezza stimata della nota

    // Calcola una posizione casuale all'interno dei limiti della whiteboard
    const randomLeft = Math.random() * (whiteboardRect.width - noteWidth);
    const randomTop = Math.random() * (whiteboardRect.height - noteHeight);

    // Posiziona la nota in una posizione casuale
    noteElement.style.left = randomLeft + 'px';
    noteElement.style.top = randomTop + 'px';
    noteElement.style.position = 'absolute';
    noteElement.style.zIndex = maxZIndex++; // Imposta il z-index e incrementa il massimo

    notesGroup.appendChild(newNote); // Aggiungi la nuova nota al gruppo di note
    setupNoteDragging(noteElement); // Imposta il trascinamento per la nuova nota

    // Salva la posizione iniziale della nota
    saveNotePosition(noteElement);
}

// Imposta il colore selezionato e aggiorna il bordo dei bottoni
function setColor(color, button) {
    selectedColor = color;
    colorButtons.forEach(btn => btn.classList.remove('border', 'border-4'));
    button.classList.add('border-4');
}

// Aggiungi gli event listener ai bottoni dei colori
colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const colorClass = Array.from(button.classList).find(cls => cls.startsWith('bg-')); // Trova la classe del colore
        setColor(colorClass, button);
    });
});

// Imposta il colore di default (giallo)
document.getElementById('yellow').classList.add('border-4');

// Imposta il trascinamento per una nota
function setupNoteDragging(noteElement) {
    let isDragging = false;
    let offsetX, offsetY;

    noteElement.addEventListener('mousedown', (e) => {
        isDragging = true;
        const noteRect = noteElement.getBoundingClientRect();
        const whiteboardRect = whiteboard.getBoundingClientRect();
        offsetX = e.clientX - noteRect.left;
        offsetY = e.clientY - noteRect.top;
        noteElement.style.cursor = 'grabbing';
        noteElement.style.zIndex = maxZIndex++; // Porta la nota in primo piano
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            let newX = e.clientX - offsetX - whiteboard.getBoundingClientRect().left;
            let newY = e.clientY - offsetY - whiteboard.getBoundingClientRect().top;

            const whiteboardRect = whiteboard.getBoundingClientRect();
            const noteRect = noteElement.getBoundingClientRect();

            // Limita la posizione della nota all'interno del whiteboard con margine di tolleranza
            if (newX < -marginTolerance) newX = -marginTolerance;
            if (newX + noteRect.width > whiteboardRect.width + marginTolerance) newX = whiteboardRect.width - noteRect.width + marginTolerance;
            if (newY < -marginTolerance) newY = -marginTolerance;
            if (newY + noteRect.height > whiteboardRect.height + marginTolerance) newY = whiteboardRect.height - noteRect.height + marginTolerance;

            noteElement.style.left = newX + 'px';
            noteElement.style.top = newY + 'px';
            noteElement.style.position = 'absolute';
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            noteElement.style.cursor = 'grab';
            saveNotePosition(noteElement); // Salva la posizione e il contenuto della nota
        }
    });

    // Aggiungi un evento di input al textarea per salvare il contenuto quando viene modificato
    const textarea = noteElement.querySelector('textarea');
    textarea.addEventListener('input', () => {
        saveNotePosition(noteElement); // Salva il contenuto della nota ogni volta che viene modificato
    });

    // Aggiungi un evento di click all'icona di eliminazione per rimuovere la nota
    const deleteIcon = noteElement.querySelector('#delete');
    deleteIcon.addEventListener('click', () => {
        notesGroup.removeChild(noteElement); // Rimuovi la nota dal DOM
        localStorage.removeItem(`notePosition_${noteElement.dataset.id}`); // Cancella la posizione della nota dalla memoria locale
    });
}

// Funzione per salvare la posizione e il contenuto della nota
function saveNotePosition(noteElement) {
    const noteRect = noteElement.getBoundingClientRect();
    const whiteboardRect = whiteboard.getBoundingClientRect();
    const textarea = noteElement.querySelector('textarea'); // Prendi il textarea della nota
    const colorClass = Array.from(noteElement.classList).find(cls => cls.startsWith('bg-')); // Trova la classe del colore
    const position = {
        left: noteRect.left - whiteboardRect.left,
        top: noteRect.top - whiteboardRect.top,
        content: textarea.value, // Salva anche il contenuto del textarea
        id: noteElement.dataset.id, // Aggiungi un identificativo unico per ogni nota
        color: colorClass // Salva la classe del colore
    };
    localStorage.setItem(`notePosition_${position.id}`, JSON.stringify(position));
}

// Funzione per caricare le note dalla memoria locale
function loadNotes() {
    const notesCount = localStorage.length;
    for (let i = 0; i < notesCount; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('notePosition_')) {
            const position = JSON.parse(localStorage.getItem(key));
            const templateId = colorToTemplate[position.color]; // Ottieni l'ID del template in base al colore salvato
            const noteTemplate = document.getElementById(templateId); // Seleziona il template corretto
            const newNote = noteTemplate.content.cloneNode(true);
            const noteElement = newNote.querySelector('div');
            const textarea = noteElement.querySelector('textarea'); // Prendi il textarea della nota
            notesGroup.appendChild(newNote);
            noteElement.style.left = position.left + 'px';
            noteElement.style.top = position.top + 'px';
            noteElement.style.position = 'absolute';
            noteElement.style.zIndex = maxZIndex++; // Imposta il z-index e incrementa il massimo
            noteElement.dataset.id = position.id; // Assicurati di avere un id unico per ogni nota
            textarea.value = position.content || ''; // Imposta il contenuto salvato
            noteElement.classList.add(position.color); // Imposta il colore salvato
            setupNoteDragging(noteElement); // Imposta il trascinamento
        }
    }
}

// Funzione per ricalcolare le posizioni delle note quando la finestra viene ridimensionata
function adjustNotesOnResize() {
    const whiteboardRect = whiteboard.getBoundingClientRect();
    const notes = notesGroup.querySelectorAll('div');
    notes.forEach(noteElement => {
        const noteRect = noteElement.getBoundingClientRect();
        let newX = noteRect.left - whiteboardRect.left;
        let newY = noteRect.top - whiteboardRect.top;

        // Limita la posizione della nota all'interno del whiteboard con margine di tolleranza
        if (newX < -marginTolerance) newX = -marginTolerance;
        if (newX + noteRect.width > whiteboardRect.width + marginTolerance) newX = whiteboardRect.width - noteRect.width + marginTolerance;
        if (newY < -marginTolerance) newY = -marginTolerance;
        if (newY + noteRect.height > whiteboardRect.height + marginTolerance) newY = whiteboardRect.height - noteRect.height + marginTolerance;

        noteElement.style.left = newX + 'px';
        noteElement.style.top = newY + 'px';
    });
}

// Seleziona il bottone clear
const clearButton = document.getElementById('clear');

// Funzione per eliminare tutte le note
function clearAllNotes() {
    // Rimuovi tutte le note dal gruppo di note
    while (notesGroup.firstChild) {
        notesGroup.removeChild(notesGroup.firstChild);
    }
    // Cancella tutte le note dalla memoria locale
    localStorage.clear();
}

// Aggiungi l'evento al bottone clear
clearButton.addEventListener('click', clearAllNotes);

// Carica le note dalla memoria locale al caricamento della pagina
loadNotes();

// Aggiungi l'evento al bottone per creare una nuova nota
newNoteButton.addEventListener('click', createNewNote);

// Aggiungi l'evento per ricalcolare le posizioni delle note al ridimensionamento della finestra
window.addEventListener('resize', adjustNotesOnResize);