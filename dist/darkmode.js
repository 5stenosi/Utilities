// Funzione per aggiornare il colore delle celle basato sul tema corrente
function updateCellColors() {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const cells = document.querySelectorAll('.size-14'); // Seleziona tutte le celle con classe 'size-14'

    cells.forEach(cell => {
        if (cell.textContent.trim() !== '') { // Se la cella ha del contenuto
            // Rimuovi i colori precedenti
            cell.classList.remove('bg-neutral-500', 'bg-stone-400');

            // Aggiungi il colore giusto basato sul tema corrente
            if (isDarkMode) {
                cell.classList.add('bg-neutral-500'); // Colore per dark mode
            } else {
                cell.classList.add('bg-stone-400'); // Colore per light mode
            }
        }
    });
}

// Funzione per cambiare il tema e salvare lo stato nel localStorage
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('change-theme').textContent = isDark ? 'DARK' : 'LIGHT';

    // Aggiorna i colori delle celle dopo il cambio tema
    updateCellColors();
}

// Event listener per il bottone di cambio tema
document.getElementById('change-theme').addEventListener('click', toggleTheme);

// Applica il tema salvato prima che la pagina venga renderizzata
(function () {
    let theme = localStorage.getItem('theme');
    if (!theme) {
        // Controlla la preferenza del sistema se non è salvato un tema nel localStorage
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme = prefersDarkScheme ? 'dark' : 'light';
    }

    // Imposta la classe 'dark' su <html> prima del caricamento della pagina
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
})();

// Aggiorna il testo del bottone e i colori delle celle quando la pagina è completamente caricata
window.addEventListener('load', function () {
    const isDark = document.documentElement.classList.contains('dark');
    document.getElementById('change-theme').textContent = isDark ? 'DARK' : 'LIGHT';

    // Aggiorna i colori delle celle all'avvio della pagina
    updateCellColors();
});
