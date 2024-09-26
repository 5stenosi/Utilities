let tooltipTimeout;
let chosenPlayer;

document.addEventListener('DOMContentLoaded', function () {
    loadPlayerValues();
    choosePlayer();
    updateTooltip();
});

document.addEventListener('mousemove', function (e) {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.left = e.pageX + 10 + 'px';
    tooltip.style.top = e.pageY - 40 + 'px';
    tooltip.style.opacity = '1';

    clearTimeout(tooltipTimeout);
    tooltipTimeout = setTimeout(function () {
        tooltip.style.opacity = '0.5';
    }, 300);
});

function choosePlayer() {
    chosenPlayer = Math.random() < 0.5 ? 'player1' : 'player2';
}

function updateTooltip() {
    const tooltip = document.getElementById('tooltip');
    const playerValue = document.getElementById(chosenPlayer).value;
    tooltip.innerText = playerValue;
}

function savePlayerValues() {
    const player1Value = document.getElementById('player1').value;
    const player2Value = document.getElementById('player2').value;
    localStorage.setItem('player1', player1Value);
    localStorage.setItem('player2', player2Value);
    updateTooltip(); // Aggiorna il tooltip ogni volta che i valori vengono salvati
}

function loadPlayerValues() {
    const player1Value = localStorage.getItem('player1');
    const player2Value = localStorage.getItem('player2');
    if (player1Value !== null) {
        document.getElementById('player1').value = player1Value;
    }
    if (player2Value !== null) {
        document.getElementById('player2').value = player2Value;
    }
}

document.getElementById('player1').addEventListener('input', savePlayerValues);
document.getElementById('player2').addEventListener('input', savePlayerValues);