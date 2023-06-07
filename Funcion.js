/**
* Calcula Velociadad final, Altura máxima, Distancia recorrida en X y Tiempo de vuelo,
* a partir de los datos ingresados por el usuario. 
* @method Nombre Calcular
* @param {number} Vi - Velocidad inicial ingresada por el usuario
* @param {number} Ang - Angulo de salida que ingresa el usuario
* @return retorna en la tabla de resultados los siguientes parametros: Velociadad final, Altura máxima, 
* Distancia recorrida en X y Tiempo de vuelo.
*/
var Vfx, Vfy, tiempo;

function Calcular() {
    let Vi = parseFloat(document.getElementById("velocidad_inicial").value);
    let Ang = parseFloat(document.getElementById("angulo_salida").value);


    if (isNaN(Vi) || isNaN(Ang)) {
        document.getElementById("velocidad_inicial").value = "";
        document.getElementById("angulo_salida").value = "";

        document.getElementById("velocidad_final").textContent = "";
        document.getElementById("altura_maxima").textContent = "";
        document.getElementById("distancia_x").textContent = "";
        document.getElementById("tiempo").textContent = "";
        alert("Ingrese datos válidos en los inputs");
    } else {
        if (Vi > 90000) {
            document.getElementById("velocidad_inicial").value = "";
            document.getElementById("angulo_salida").value = "";

            document.getElementById("velocidad_final").textContent = "";
            document.getElementById("altura_maxima").textContent = "";
            document.getElementById("distancia_x").textContent = "";
            document.getElementById("tiempo").textContent = "";
            alert("No ingrese un valor mayor a 90000 en la velocidad inicial");
        } else {
            if (Ang >= 90) {
                document.getElementById("velocidad_inicial").value = "";
                document.getElementById("angulo_salida").value = "";

                document.getElementById("velocidad_final").textContent = "";
                document.getElementById("altura_maxima").textContent = "";
                document.getElementById("distancia_x").textContent = "";
                document.getElementById("tiempo").textContent = "";
                alert("No ingrese un valor mayor a 89 en el ángulo de salida");
            } else {
                let ang_r = Ang * (Math.PI / 180);
                Vfx = Vi * Math.cos(ang_r);
                Vfy = Vi * Math.sin(ang_r);

                let Vf = Math.sqrt(Math.pow(Vfx, 2) + Math.pow(Vfy, 2));
                document.getElementById("velocidad_final").textContent = Vf.toFixed(2);

                tiempo = (2 * Vfy) / 9.81;
                document.getElementById("tiempo").textContent = tiempo.toFixed(2);

                let altura_maxima = Math.pow(Vfy, 2) / (2 * 9.81);
                document.getElementById("altura_maxima").textContent = altura_maxima.toFixed(2);

                let distancia_x = Vfx * tiempo;
                document.getElementById("distancia_x").textContent = distancia_x.toFixed(2);

                generarLienzo();
            }
        }
    }
}

/**
 * Genera el lienzo (canvas) y dibuja la trayectoria del tiro parabólico
 * @method nombre generarLienzo
 * @param {number} Vfx - Velocidad horizontal del proyectil
 * @param {number} Vfy - Velocidad vertical del proyectil
 * @param {number} tiempo - Tiempo de vuelo del proyectil
 * @return retorna la representación gráfica en la etiqueta <canvas>.
 */
function generarLienzo() {
    let canvas = document.querySelector("canvas");
    let ctx = canvas.getContext("2d");
    let timeStep = 0.1;
    let totalTime = tiempo;
    let numSteps = totalTime / timeStep;

    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    let scale = 8;
    let originX = 0;
    let originY = canvasHeight;

    function Coordenadas(x, y) {
        let canvasX = originX + x * scale;
        let canvasY = originY - y * scale;
        return { x: canvasX, y: canvasY };
    }

    function Trayectoria() {
        let x = 0;
        let y = 0;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.beginPath();
        ctx.moveTo(originX, originY);

        let totalTime = tiempo;
        let numSteps = totalTime / timeStep;
        let initialY = Vfy * totalTime - 0.5 * 9.81 * Math.pow(totalTime, 2);

        let i = 0;
        function ProximoPunto() {
            if (i <= numSteps) {
                x = Vfx * (i * timeStep);
                y = initialY + Vfy * (i * timeStep) - 0.5 * 9.81 * Math.pow(i * timeStep, 2);
                if (y < 0) y = 0;
                var canvasCoords = Coordenadas(x, y);

                ctx.lineTo(canvasCoords.x, canvasCoords.y);
                ctx.stroke();

                i++;
                setTimeout(ProximoPunto, 100);
            }
        }

        ProximoPunto();
    }

    Trayectoria();
}

