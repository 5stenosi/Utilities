// Seleziona gli elementi
const note = document.getElementById('note');
const whiteboard = document.getElementById('whiteboard');

// Variabili per memorizzare lo stato del trascinamento
let isDragging = false;
let offsetX, offsetY;

// Aggiungi l'evento mousedown alla nota
note.addEventListener('mousedown', (e) => {
    isDragging = true;

    // Ottieni il bounding box della nota e del whiteboard
    const noteRect = note.getBoundingClientRect();
    const whiteboardRect = whiteboard.getBoundingClientRect();

    // Calcola l'offset rispetto alla posizione del whiteboard
    offsetX = e.clientX - noteRect.left + 1.5;
    offsetY = e.clientY - noteRect.top + 1.5;

    // Imposta il cursore per indicare il trascinamento
    note.style.cursor = 'grabbing';
});

// Aggiungi l'evento mousemove al documento
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        // Calcola la nuova posizione della nota rispetto al whiteboard
        let newX = e.clientX - offsetX - whiteboard.getBoundingClientRect().left;
        let newY = e.clientY - offsetY - whiteboard.getBoundingClientRect().top;

        // Ottieni i confini del whiteboard e della nota
        const whiteboardRect = whiteboard.getBoundingClientRect();
        const noteRect = note.getBoundingClientRect();

        // Assicurati che la nota non esca dai confini del whiteboard
        if (newX < 0) {
            newX = 0;
        } else if (newX + noteRect.width > whiteboardRect.width) {
            newX = whiteboardRect.width - noteRect.width;
        }

        if (newY < 0) {
            newY = 0;
        } else if (newY + noteRect.height > whiteboardRect.height) {
            newY = whiteboardRect.height - noteRect.height;
        }

        // Imposta la nuova posizione della nota
        note.style.left = newX + 'px';
        note.style.top = newY + 'px';
        note.style.position = 'absolute';
    }
});

// Aggiungi l'evento mouseup per fermare il trascinamento
document.addEventListener('mouseup', () => {
    isDragging = false;
    note.style.cursor = 'grab';
});