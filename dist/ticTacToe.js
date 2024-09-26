let tooltipTimeout;
let chosenPlayer;
let tooltipX = 0;
let tooltipY = 0;
let targetX = 0;
let targetY = 0;
let tooltipInitialized = false;

document.addEventListener('DOMContentLoaded', function () {
    loadPlayerValues();
    choosePlayer();
    updateTooltip();
});

document.addEventListener('mousemove', function (e) {
    if (!tooltipInitialized) {
        initializeTooltip(e);
        tooltipInitialized = true;
    }

    targetX = e.pageX + 10;
    targetY = e.pageY - 40;

    const tooltip = document.getElementById('tooltip');
    tooltip.style.opacity = '1'; // Reset opacity to 1 when mouse moves

    clearTimeout(tooltipTimeout);
    tooltipTimeout = setTimeout(function () {
        tooltip.style.opacity = '0.5';
    }, 300);
});

function initializeTooltip(e) {
    const tooltip = document.getElementById('tooltip');
    tooltipX = e.pageX + 10;
    tooltipY = e.pageY - 40;
    tooltip.style.left = tooltipX + 'px';
    tooltip.style.top = tooltipY + 'px';
    animateTooltip();
}

function animateTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltipX += (targetX - tooltipX) * 0.1;
    tooltipY += (targetY - tooltipY) * 0.1;
    tooltip.style.left = tooltipX + 'px';
    tooltip.style.top = tooltipY + 'px';
    requestAnimationFrame(animateTooltip);
}

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