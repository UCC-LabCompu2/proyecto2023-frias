/**
* Calcula Velociadad final, Altura máxima, Distancia recorrida en X y Tiempo de vuelo,
* a partir de los datos ingresados por el usuario. 
* @method Nombre Calcular
* @param {number} Vi - Velocidad inicial ingresada por el usuario
* @param {number} Ang - Angulo de salida que ingresa el usuario
* @return retorna en la tabla de resultados los siguientes parametros: Velociadad final, Altura máxima, 
* Distancia recorrida en X y Tiempo de vuelo
*/
function Calcular() {
    var Vi = parseFloat(document.getElementById("velocidad_inicial").value);
    var Ang = parseFloat(document.getElementById("angulo_salida").value);
    var Vfx, Vfy;

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
                var ang_r = Ang * (Math.PI / 180);
                Vfx = Vi * Math.cos(ang_r);
                Vfy = Vi * Math.sin(ang_r);

                var Vf = Math.sqrt(Math.pow(Vfx, 2) + Math.pow(Vfy, 2));
                document.getElementById("velocidad_final").textContent = Vf.toFixed(2);

                var tiempo = (2 * Vfy) / 9.81;
                document.getElementById("tiempo").textContent = tiempo.toFixed(2);

                var altura_maxima = Math.pow(Vfy, 2) / (2 * 9.81);
                document.getElementById("altura_maxima").textContent = altura_maxima.toFixed(2);

                var distancia_x = Vfx * tiempo;
                document.getElementById("distancia_x").textContent = distancia_x.toFixed(2);

                generarLienzo(Vfx, Vfy, tiempo);
            }
        }
    }
}

/**
 * Genera el lienzo (canvas) y dibuja la trayectoria del tiro parabólico
 * @param {number} Vfx - Velocidad horizontal del proyectil
 * @param {number} Vfy - Velocidad vertical del proyectil
 * @param {number} tiempo - Tiempo de vuelo del proyectil
 */
function generarLienzo(Vfx, Vfy, tiempo) {
    var canvas = document.querySelector("canvas");
    var ctx = canvas.getContext("2d");
    var timeStep = 0.1;
    var totalTime = tiempo;
    var numSteps = totalTime / timeStep;

    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var scale = 8;
    var originX = 0;
    var originY = canvasHeight;

    function toCanvasCoordinates(x, y) {
        var canvasX = originX + x * scale;
        var canvasY = originY - y * scale;
        return { x: canvasX, y: canvasY };
    }

    function drawTrajectory() {
        var x = 0;
        var y = 0;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.beginPath();
        ctx.moveTo(originX, originY);

        for (var i = 0; i <= numSteps; i++) {
            x = Vfx * (i * timeStep);
            y = Vfy * (i * timeStep) - 0.5 * 9.81 * Math.pow(i * timeStep, 2);
            var canvasCoords = toCanvasCoordinates(x, y);
            ctx.lineTo(canvasCoords.x, canvasCoords.y);
        }

        ctx.stroke();
    }

    drawTrajectory();
}

