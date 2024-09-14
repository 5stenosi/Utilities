// darkmode.js

// Function to toggle theme and save state to localStorage
function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('change-theme').textContent = isDark ? 'DARK' : 'LIGHT';
}

// Event listener for theme change button
document.getElementById('change-theme').addEventListener('click', toggleTheme);

// On page load, set the theme based on localStorage value or system preference
window.addEventListener('load', function () {
    let theme = localStorage.getItem('theme');
    if (!theme) {
        // Check system preference if no theme is saved in localStorage
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme = prefersDarkScheme ? 'dark' : 'light';
    }

    if (theme === 'dark') {
        document.body.classList.add('dark');
        document.getElementById('change-theme').textContent = 'DARK';
    } else {
        document.body.classList.remove('dark');
        document.getElementById('change-theme').textContent = 'LIGHT';
    }
});