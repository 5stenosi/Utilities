import { toggleTheme } from './darkmode.js';

document.addEventListener('DOMContentLoaded', () => {
    // Funzione per aggiornare la rotazione della sfera in base all'ora attuale
    function updateSundialRotation() {
        const sphere = document.getElementById('sphere');
        const timeDisplay = document.getElementById('time');
        
        const currentTime = new Date();

        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const seconds = currentTime.getSeconds();

        // Converti l'orario in gradi di rotazione
        const degrees = ((hours % 24) + (minutes / 60) + (seconds / 3600) - 12) * 15;

        // Applica la rotazione all'elemento con id "sphere"
        sphere.style.transform = `rotate(${degrees}deg)`;

        if (hours >= 6 && hours < 18) {
            if (document.documentElement.classList.contains('dark')) {
                toggleTheme();
            }
        } else {
            if (!document.documentElement.classList.contains('dark')) {
                toggleTheme();
            }
        }

        // Aggiorna l'elemento h1 con l'ora corrente
        timeDisplay.textContent = currentTime.toLocaleTimeString();
    }

    // Aggiorna la rotazione della sfera ogni 100 millisecondi
    setInterval(updateSundialRotation, 100);

    // Aggiorna la rotazione immediatamente al caricamento della pagina
    updateSundialRotation();
});

// DISPLAY TIME DISPLAY TIME DISPLAY TIME DISPLAY TIME DISPLAY TIME DISPLAY TIME DISPLAY TIME DISPLAY TIME DISPLAY TIME

