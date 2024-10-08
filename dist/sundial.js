function rotateSphere() {
    const sphere = document.getElementById('sphere');
    if (!sphere) {
        console.error('Element with id "sphere" not found.');
        return;
    }

    function updateRotation() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const totalMinutes = hours * 60 + minutes;

        // Calcola l'angolo di rotazione da 0° (mezzogiorno) a 180° (mezzanotte)
        const angle = (totalMinutes / (24 * 60)) * 120;
        sphere.style.transform = `rotate(${angle}deg)`;
    }

    updateRotation();
    setInterval(updateRotation, 60000); // Aggiorna ogni minuto
}

rotateSphere();
