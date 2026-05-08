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
function drawViewport(xmin, ymin, xmax, ymax){

    ctx.strokeStyle = "blue";
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
    const BOTTOM = 4;
    const TOP = 8;

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
    const BOTTOM = 4;
    const TOP = 8;

    let code1 = computeCode(x1, y1, xmin, ymin, xmax, ymax);
    let code2 = computeCode(x2, y2, xmin, ymin, xmax, ymax);

    let accept = false;

    while(true){

        if((code1 | code2) === 0){

            accept = true;
            break;
        }

        else if((code1 & code2) !== 0){

            break;
        }

        else{

            let codeOut;
            let x, y;

            if(code1 !== 0){
                codeOut = code1;
            }else{
                codeOut = code2;
            }

            if(codeOut & TOP){

                x = x1 + (x2 - x1) * (ymin - y1) / (y2 - y1);
                y = ymin;
            }

            else if(codeOut & BOTTOM){

                x = x1 + (x2 - x1) * (ymax - y1) / (y2 - y1);
                y = ymax;
            }

            else if(codeOut & RIGHT){

                y = y1 + (y2 - y1) * (xmax - x1) / (x2 - x1);
                x = xmax;
            }

            else if(codeOut & LEFT){

                y = y1 + (y2 - y1) * (xmin - x1) / (x2 - x1);
                x = xmin;
            }

            if(codeOut === code1){

                x1 = x;
                y1 = y;

                code1 = computeCode(x1, y1, xmin, ymin, xmax, ymax);
            }

            else{

                x2 = x;
                y2 = y;

                code2 = computeCode(x2, y2, xmin, ymin, xmax, ymax);
            }
        }
    }

    if(accept){

        return {
            visible: true,
            x1,
            y1,
            x2,
            y2
        };
    }

    return {
        visible: false
    };
}
