import { toggleTheme } from './darkmode.js';

document.addEventListener('DOMContentLoaded', () => {
    // Funzione per aggiornare la rotazione della sfera in base all'ora attuale
    function updateSundialRotation() {
        const sphere = document.getElementById('sphere');
        const timeDisplay = document.getElementById('time');
        
        // Ottenere l'ora corrente
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        // Converti l'orario in gradi di rotazione
        const degrees = ((hours % 24) + (minutes / 60) + (seconds / 3600) - 12) * 15;

        // Applica la rotazione all'elemento con id "sphere"
        sphere.style.transform = `rotate(${degrees}deg)`;

        // Controlla l'angolazione e imposta il tema di conseguenza
        if (degrees > 90 && degrees < 180) {
            if (!document.documentElement.classList.contains('dark')) {
                toggleTheme();
            }
        } else {
            if (document.documentElement.classList.contains('dark')) {
                toggleTheme();
            }
        }

        // Aggiorna l'elemento h1 con l'ora corrente
        timeDisplay.textContent = now.toLocaleTimeString();
    }

    // Aggiorna la rotazione della sfera ogni 100 millisecondi
    setInterval(updateSundialRotation, 1000);

    // Aggiorna la rotazione immediatamente al caricamento della pagina
    updateSundialRotation();

    console.log(now.toLocaleTimeString());
});