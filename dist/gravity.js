// Seleziona gli elementi
const shapeButtons = document.querySelectorAll('#circle-shape, #square-shape');
const newShapeButton = document.getElementById('new-shape');
const clearButton = document.getElementById('clear');
const playground = document.getElementById('playground');

// Inizializza Matter.js
const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint } = Matter;
let engine = Engine.create();
let world = engine.world;

// Setup del playground per renderizzare la simulazione
const render = Render.create({
    element: playground,
    engine: engine,
    options: {
        width: playground.clientWidth,
        height: playground.clientHeight,
        wireframes: false // Rende i corpi solidi e colorati
    }
});

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// Aggiungi i bordi del playground
const boundaries = [
    Bodies.rectangle(playground.clientWidth / 2, 0, playground.clientWidth, 10, { isStatic: true }),  // Bordo superiore
    Bodies.rectangle(playground.clientWidth / 2, playground.clientHeight, playground.clientWidth, 10, { isStatic: true }), // Bordo inferiore
    Bodies.rectangle(0, playground.clientHeight / 2, 10, playground.clientHeight, { isStatic: true }), // Bordo sinistro
    Bodies.rectangle(playground.clientWidth, playground.clientHeight / 2, 10, playground.clientHeight, { isStatic: true })  // Bordo destro
];

World.add(world, boundaries);

// Funzione per impostare il bordo selezionato
function setSelectedBorder(button) {
    shapeButtons.forEach(btn => btn.classList.remove('border-4'));
    button.classList.add('border-4');
}

// Aggiungi gli event listener ai bottoni delle forme
shapeButtons.forEach(button => {
    button.addEventListener('click', () => {
        setSelectedBorder(button);
    });
});

// Funzione per creare una nuova forma con Matter.js
function createNewShape() {
    const selectedShapeButton = Array.from(shapeButtons).find(button => button.classList.contains('border-4'));
    if (!selectedShapeButton) return;

    const shapeType = selectedShapeButton.id === 'circle-shape' ? 'circle' : 'square';

    const playgroundRect = playground.getBoundingClientRect();
    const shapeSize = 80;
    const randomX = Math.random() * playgroundRect.width;
    const randomY = Math.random() * playgroundRect.height;

    let shape;

    if (shapeType === 'circle') {
        shape = Bodies.circle(randomX, randomY, shapeSize / 2, {
            render: {
                fillStyle: 'blue'
            }
        });
    } else {
        shape = Bodies.rectangle(randomX, randomY, shapeSize, shapeSize, {
            render: {
                fillStyle: 'red'
            }
        });
    }

    World.add(world, shape);
}

// Aggiungi il mouse constraint per permettere il drag-and-drop con Matter.js
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});
World.add(world, mouseConstraint);

// Aggiungi l'event listener al bottone new-shape
newShapeButton.addEventListener('click', createNewShape);

// Funzione per rimuovere tutte le forme dal playground
function clearShapes() {
    World.clear(world); // Rimuove tutte le forme
    World.add(world, boundaries); // Re-aggiunge i confini
}

// Aggiungi l'event listener al bottone clear
clearButton.addEventListener('click', clearShapes);