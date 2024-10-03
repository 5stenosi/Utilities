let maxZIndex = 1000;

document.querySelectorAll('.rod').forEach(rod => {
    const beads = rod.querySelectorAll('.bead');

    beads.forEach((bead, index) => {
        bead.addEventListener('mousedown', (event) => {
            const rodRect = rod.getBoundingClientRect();
            const beadRect = bead.getBoundingClientRect();
            let startX = event.clientX;

            // Incrementa il valore massimo di z-index e assegnalo al bead selezionato
            maxZIndex++;
            bead.style.zIndex = maxZIndex;

            // Memorizza le posizioni iniziali di tutti i beads
            const initialLefts = Array.from(beads).map(b => parseInt(window.getComputedStyle(b).left, 10) || 0);

            const moveBead = (e) => {
                let deltaX = e.clientX - startX; // Spostamento relativo del mouse
                let newLeft = initialLefts[index] + deltaX;

                // Limita il movimento all'interno della rod
                const minLeft = 0;
                const maxLeft = rodRect.width - beadRect.width;

                // Controllo per non andare oltre i limiti della rod
                if (newLeft < minLeft) newLeft = minLeft; // Limite sinistro
                if (newLeft > maxLeft) newLeft = maxLeft; // Limite destro

                // Variabile per tenere traccia se la bead si blocca
                let shouldStop = false;

                // Controllo collisione a destra
                for (let i = index + 1; i < beads.length; i++) {
                    const prevBead = beads[i - 1];
                    const nextBead = beads[i];
                    const prevLeft = parseInt(window.getComputedStyle(prevBead).left, 10) || 0;
                    const nextLeft = parseInt(window.getComputedStyle(nextBead).left, 10) || 0;
                    const distance = beadRect.width + 3; // Distanza tra i beads (con margine)

                    // Se c'è una collisione, blocca il bead selezionato
                    if (nextLeft < prevLeft + distance) {
                        shouldStop = true; // Blocca il bead selezionato
                        break;
                    }
                }

                // Controllo collisione a sinistra
                for (let i = index - 1; i >= 0; i--) {
                    const prevBead = beads[i];
                    const nextBead = beads[i + 1];
                    const prevLeft = parseInt(window.getComputedStyle(prevBead).left, 10) || 0;
                    const nextLeft = parseInt(window.getComputedStyle(nextBead).left, 10) || 0;
                    const distance = beadRect.width + 3; // Distanza tra i beads (con margine)

                    // Se c'è una collisione, blocca il bead selezionato
                    if (prevLeft > nextLeft - distance) {
                        shouldStop = true; // Blocca il bead selezionato
                        break;
                    }
                }

                // Se non ci sono collisioni, aggiorna la posizione del bead
                if (!shouldStop) {
                    bead.style.left = `${newLeft}px`;
                }

                // Gestisci il movimento dei beads successivi
                for (let i = index + 1; i < beads.length; i++) {
                    const prevBead = beads[i - 1];
                    const nextBead = beads[i];
                    const prevLeft = parseInt(window.getComputedStyle(prevBead).left, 10) || 0;
                    const nextLeft = parseInt(window.getComputedStyle(nextBead).left, 10) || 0;
                    const distance = beadRect.width + 3; // Distanza tra i beads (con margine)

                    // Se c'è una collisione, sposta il bead successivo
                    if (nextLeft < prevLeft + distance) {
                        nextBead.style.left = `${prevLeft + distance}px`;

                        // Controlla se il bead successivo è all'interno della rod
                        const nextBeadLeft = parseInt(window.getComputedStyle(nextBead).left, 10) || 0;
                        if (nextBeadLeft > maxLeft) {
                            nextBead.style.left = `${maxLeft}px`;
                        }
                    }
                }

                // Gestisci il movimento dei beads precedenti
                for (let i = index - 1; i >= 0; i--) {
                    const nextBead = beads[i + 1];
                    const prevBead = beads[i];
                    const prevLeft = parseInt(window.getComputedStyle(prevBead).left, 10) || 0;
                    const nextLeft = parseInt(window.getComputedStyle(nextBead).left, 10) || 0;
                    const distance = beadRect.width + 3; // Distanza tra i beads (con margine)

                    // Se c'è una collisione, sposta il bead precedente
                    if (prevLeft > nextLeft - distance) {
                        prevBead.style.left = `${nextLeft - distance}px`;

                        // Controlla se il bead precedente è all'interno della rod
                        const prevBeadLeft = parseInt(window.getComputedStyle(prevBead).left, 10) || 0;
                        if (prevBeadLeft < minLeft) {
                            prevBead.style.left = `${minLeft}px`;
                        }
                    }
                }
            };

            // Ascolta l'evento di spostamento del mouse
            document.addEventListener('mousemove', moveBead);

            // Ferma lo spostamento quando il mouse viene rilasciato
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', moveBead);
            }, { once: true });
        });
    });
});