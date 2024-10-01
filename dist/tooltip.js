let tooltipTimeout;
let tooltipX = 0;
let tooltipY = 0;
let targetX = 0;
let targetY = 0;
let tooltipInitialized = false;

document.addEventListener('DOMContentLoaded', function () {
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
    }, 500);

    // Check if the tooltip goes off the right edge of the screen
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    if (targetX + tooltipWidth > screenWidth) {
        targetX = e.pageX - tooltipWidth - 10;
    }

    // Check if the tooltip goes off the left edge of the screen
    if (targetX < 0) {
        targetX = e.pageX + 10;
    }

    // Check if the tooltip goes off the bottom edge of the screen
    if (targetY + tooltipHeight > screenHeight) {
        targetY = e.pageY - tooltipHeight - 10;
    }

    // Check if the tooltip goes off the top edge of the screen
    if (targetY < 0) {
        targetY = e.pageY + 10;
    }
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
    const interpolationFactor = 0.1; // Change this value to modify the speed
    tooltipX += (targetX - tooltipX) * interpolationFactor;
    tooltipY += (targetY - tooltipY) * interpolationFactor;
    tooltip.style.left = tooltipX + 'px';
    tooltip.style.top = tooltipY + 'px';
    requestAnimationFrame(animateTooltip);
}

export function updateTooltip(message) {
    const tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = message;
}