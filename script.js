const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.translate(0, canvas.height);
ctx.scale(1, -1);

let currentScene = 0;
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
function drawViewport(xmin, ymin, xmax, ymax){

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.strokeRect(
        xmin,
        ymin,
        xmax - xmin,
        ymax - ymin
    );
}
function drawLine(x1, y1, x2, y2, color){

    ctx.beginPath();

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.stroke();
}
function computeCode(x, y, xmin, ymin, xmax, ymax){

    let code = 0;

    const LEFT = 1;
    const RIGHT = 2;
    const TOP = 4;
    const BOTTOM = 8;

    if(x < xmin){
        code |= LEFT;
    }

    if(x > xmax){
        code |= RIGHT;
    }

    if(y < ymin){
        code |= TOP;
    }

    if(y > ymax){
        code |= BOTTOM;
    }

    return code;
}
function cohenSutherland(x1, y1, x2, y2, xmin, ymin, xmax, ymax){

    const LEFT = 1;
    const RIGHT = 2;
    const TOP = 4;
    const BOTTOM = 8;

    let code1 = computeCode(x1, y1, xmin, ymin, xmax, ymax);
    let code2 = computeCode(x2, y2, xmin, ymin, xmax, ymax);

    let accept = false;

    while(true){

        //ambos puntos dentro
        if((code1 | code2) === 0){

            accept = true;
            break;
        }

        //ambos puntos fuera en misma región
        else if((code1 & code2) !== 0){

            break;
        }

        else{

            let codeOut;
            let x, y;

            if(code1 !== 0){
                codeOut = code1;
            }

            else{
                codeOut = code2;
            }

            // TOP
            if(codeOut & TOP){

                x = x1 + (x2 - x1) * (ymin - y1) / (y2 - y1);
                y = ymin;
            }

            // BOTTOM
            else if(codeOut & BOTTOM){

                x = x1 + (x2 - x1) * (ymax - y1) / (y2 - y1);
                y = ymax;
            }

            // RIGHT
            else if(codeOut & RIGHT){

                y = y1 + (y2 - y1) * (xmax - x1) / (x2 - x1);
                x = xmax;
            }

            // LEFT
            else if(codeOut & LEFT){

                y = y1 + (y2 - y1) * (xmin - x1) / (x2 - x1);
                x = xmin;
            }

            if(codeOut === code1){

                x1 = x;
                y1 = y;

                code1 = computeCode(
                    x1,
                    y1,
                    xmin,
                    ymin,
                    xmax,
                    ymax
                );
            }

            else{

                x2 = x;
                y2 = y;

                code2 = computeCode(
                    x2,
                    y2,
                    xmin,
                    ymin,
                    xmax,
                    ymax
                );
            }
        }
    }

    if(accept){

        return{
            visible: true,
            x1,
            y1,
            x2,
            y2
        };
    }

    return{
        visible: false
    };
}

function render(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const xmin = parseInt(document.getElementById("xmin").value);
    const ymin = parseInt(document.getElementById("ymin").value);
    const xmax = parseInt(document.getElementById("xmax").value);
    const ymax = parseInt(document.getElementById("ymax").value);

    drawViewport(xmin, ymin, xmax, ymax);

    const line = scenes[currentScene];
    //línea original
    drawLine(
        line.x1,
        line.y1,
        line.x2,
        line.y2,
        "red"
    );
    const result = cohenSutherland(
        line.x1,
        line.y1,
        line.x2,
        line.y2,
        xmin,
        ymin,
        xmax,
        ymax
    );
    //parte visible
    if(result.visible){
        drawLine(
            result.x1,
            result.y1,
            result.x2,
            result.y2,
            "green"
        );

        document.getElementById("caseText").innerText =
            "Línea aceptada parcialmente o totalmente";
    }

    else{
        document.getElementById("caseText").innerText =
            "Línea rechazada";
    }
}
//botón siguiente
document.getElementById("next").addEventListener("click", () => {

    currentScene++;

    if(currentScene >= scenes.length){
        currentScene = 0;
    }

    render();
});
//botón anterior
document.getElementById("prev").addEventListener("click", () => {

    currentScene--;

    if(currentScene < 0){
        currentScene = scenes.length - 1;
    }

    render();
});
//actualizar viewport
document.getElementById("update").addEventListener("click", render);
//render inicial
render();
