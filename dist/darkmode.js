// Funzione per aggiornare il colore delle celle basato sul tema corrente
function updateCellColors(isDark) {
    const cells = document.querySelectorAll('#grid .size-14');
    cells.forEach(cell => {
        // Mantieni il colore delle celle in base al loro stato
        if (cell.classList.contains('bg-green-500')) {
            cell.classList.remove('bg-stone-400', 'bg-neutral-500');
            cell.classList.add('bg-green-500');
        }
        if (cell.classList.contains('bg-yellow-500')) {
            cell.classList.remove('bg-stone-400', 'bg-neutral-500');
            cell.classList.add('bg-yellow-500');
        }
        if (cell.classList.contains('bg-red-500')) {
            cell.classList.remove('bg-stone-400', 'bg-neutral-500');
            cell.classList.add('bg-red-500');
        }
    });
}

// Funzione per cambiare il tema e salvare lo stato nel localStorage
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('change-theme').textContent = isDark ? 'DARK' : 'LIGHT';

    // Aggiorna il colore delle celle in base al tema
    updateCellColors(isDark);

    // Cambia il numero nella src dell'immagine da 1 a 2
    const pageLogo = document.querySelector('#page-logo');
    if (!isDark) {
        pageLogo.href = pageLogo.href.replace('1.svg', '2.svg');
    } else pageLogo.href = pageLogo.href.replace('2.svg', '1.svg');
}

// Funzione per applicare il tema salvato
function applySavedTheme() {
    let theme = localStorage.getItem('theme');
    if (!theme) {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme = prefersDarkScheme ? 'dark' : 'light';
    }

    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    // Aggiorna i colori delle celle in base al tema salvato
    updateCellColors(theme === 'dark');

    // Aggiorna il logo in base al tema salvato
    const pageLogo = document.querySelector('#page-logo');
    if (theme === 'dark') {
        pageLogo.href = pageLogo.href.replace('2.svg', '1.svg');
    } else {
        pageLogo.href = pageLogo.href.replace('1.svg', '2.svg');
    }
}

// Funzione per inizializzare il tema all'avvio della pagina
function initializeTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    document.getElementById('change-theme').textContent = isDark ? 'DARK' : 'LIGHT';

    // Aggiorna i colori delle celle all'avvio della pagina
    updateCellColors(isDark);

    // Aggiorna il logo all'avvio della pagina
    const pageLogo = document.querySelector('#page-logo');
    if (isDark) {
        pageLogo.href = pageLogo.href.replace('2.svg', '1.svg');
    } else {
        pageLogo.href = pageLogo.href.replace('1.svg', '2.svg');
    }
}

// Event listener per il bottone di cambio tema
document.getElementById('change-theme').addEventListener('click', toggleTheme);

// Applica il tema salvato prima che la pagina venga renderizzata
(function () {
    applySavedTheme();
})();

// Aggiorna il testo del bottone e i colori delle celle quando la pagina è completamente caricata
window.addEventListener('load', initializeTheme);