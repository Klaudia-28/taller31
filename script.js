const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scenes = [

    // Caso 1: completamente dentro
    { x1: 200, y1: 150, x2: 400, y2: 250 },
    // Caso 2: completamente fuera
    { x1: 10, y1: 20, x2: 50, y2: 40 },
    // Caso 3: entra por la izquierda
    { x1: 50, y1: 200, x2: 300, y2: 200 },
    // Caso 4: sale por la derecha
    { x1: 250, y1: 200, x2: 550, y2: 200 },
    // Caso 5: atraviesa toda la ventana
    { x1: 50, y1: 50, x2: 550, y2: 350 }
];
