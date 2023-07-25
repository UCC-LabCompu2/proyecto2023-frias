var Vfx, Vfy, altMax, tiempo; // Variables globales para almacenar los cálculos
/** 
 * Calcula Velociadad final, Altura máxima, Distancia recorrida en X y Tiempo de vuelo, 
 * a partir de los datos ingresados por el usuario.  
 * @method Calcular 
 * @return retorna en la tabla de resultados los siguientes parametros: Velociadad final, Altura máxima,  
 * Distancia recorrida en X y Tiempo de vuelo. 
 */
function Calcular() {

    //inhabilita el boton calcular.
    document.getElementById('botoncalc').disabled = true;

    let Vi = parseFloat(document.getElementById("velocidad_inicial").value);
    let Ang = parseFloat(document.getElementById("angulo_salida").value);
    let Vf, distX;

    //valida todas las entradas de datos y deja vacios los espacios en la tabla.
    if ((isNaN(Vi) || isNaN(Ang)) || (Vi > 90000) || (Vi <= 0) || (Ang >= 90) || (Ang <= 0)) {
        if (isNaN(Vi)) {
            alert("Ingrese datos válidos en la velocidad");
            document.getElementById("velocidad_inicial").value = "";
        }
        if (isNaN(Ang)) {
            alert("Ingrese datos válidos en el ángulo de salida");
            document.getElementById("angulo_salida").value = "";
        }
        if (Vi > 90000) {
            alert("No ingrese un valor mayor a 90000 en la velocidad inicial");
            document.getElementById("velocidad_inicial").value = "";
        }
        if (Vi <= 0) {
            alert("No ingrese un valor menor o igual a 0 en la velocidad inicial");
            document.getElementById("velocidad_inicial").value = "";
        }
        if (Ang >= 90) {
            alert("No ingrese un valor mayor a 89 en el ángulo de salida");
            document.getElementById("angulo_salida").value = "";
        }
        if (Ang <= 0) {
            alert("No ingrese un valor menor o igual a 0 en el ángulo de salida");
            document.getElementById("angulo_salida").value = "";
        }

        document.getElementById("velocidad_final").textContent = "";
        document.getElementById("altura_maxima").textContent = "";
        document.getElementById("distancia_x").textContent = "";
        document.getElementById("tiempo").textContent = "";

        //habilita nuevamente el boton calcular.
        document.getElementById('botoncalc').disabled = false;
    } else {

        //calcula y completa la tabla de resultados.
        let ang_r = Ang * (Math.PI / 180);
        Vfx = Vi * Math.cos(ang_r);
        Vfy = Vi * Math.sin(ang_r);

        Vf = Math.sqrt(Math.pow(Vfx, 2) + Math.pow(Vfy, 2));
        tiempo = (2 * Vfy) / 9.81;
        altMax = Math.pow(Vfy, 2) / (2 * 9.81);
        distX = Vfx * tiempo;

        document.getElementById("velocidad_final").textContent = Vf.toFixed(2);
        document.getElementById("tiempo").textContent = tiempo.toFixed(2);
        document.getElementById("altura_maxima").textContent = altMax.toFixed(2);
        document.getElementById("distancia_x").textContent = distX.toFixed(2);

        generarLienzo();
    }
}

/**
 * Genera el lienzo (canvas) y dibuja la trayectoria del tiro parabólico.
 * @method generarLienzo
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
    let originX = 30;
    let originY = canvasHeight - 20;

    /** 
    * calcula las posiciones x e y de las coordenadas que recibe, ajustandolas al origen y a la escala 
    * que esta definida. 
    * @method Nombre Coordenadas
    * @param {number} x - posicion en el eje x del proximo punto a graficar.
    * @param {number} y - posicion en el eje y del proximo punto a graficar.
    * @return retorna las coordenadas x e y ajustadas al lienzo. 
    */
    function Coordenadas(x, y) {
        let canvasX = originX + x * scale;
        let canvasY = originY - y * scale;
        return { x: canvasX, y: canvasY };
    }
    /** 
    * dibuja los ejes x e y, les signa una graduación, calcula la coordenada inicial en y
    * y llama a la funcion ProximoPunto.  
    * a partir de los datos ingresados por el usuario.  
    * @method Trayectoria
    * @return retorna en el lienzo, un par de ejes coordenados, con su graduacion y dibuja la trayectoria del 
    * proyectil.
    */
    function Trayectoria() {
        let x = 0;
        let y = 0;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // dibuja los ejes x e y.
        ctx.beginPath();
        ctx.moveTo(originX, 0);
        ctx.lineTo(originX, canvasHeight);
        ctx.moveTo(0, originY);
        ctx.lineTo(canvasWidth, originY);
        ctx.stroke();

        //Dibuja la unidad de la graduación "(m)".
        ctx.font = "9px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("(m)", originX - 25, originY + 15);

        // agrega labels a los ejes.
        ctx.font = "9px Arial";
        ctx.fillStyle = "black";

        // dibuja la graduación (lineas y numeros) del eje x.
        for (let i = 0; i <= canvasWidth / scale; i += 2) {
            let xCoord = originX + i * scale;
            ctx.moveTo(xCoord, originY - 3);
            ctx.lineTo(xCoord, originY + 3);
            ctx.stroke();
            ctx.fillText(i, xCoord - 5, originY + 15);
        }

        // dibuja la graduación (lineas y numeros) del eje y.
        for (let i = 0; i <= canvasHeight / scale; i += 2) {
            let yCoord = originY - i * scale;
            ctx.moveTo(originX - 3, yCoord);
            ctx.lineTo(originX + 3, yCoord);
            ctx.stroke();
            ctx.fillText(i, originX - 20, yCoord + 5);
        }

        // calcula la coordenada inicial en y.
        let initialY = Vfy * totalTime - 0.5 * 9.81 * Math.pow(totalTime, 2);
        y = initialY;
        let canvasCoords = Coordenadas(x, y);
        ctx.beginPath();
        ctx.moveTo(canvasCoords.x, canvasCoords.y);

        /** 
         * Calcula la posicion punto por punto con intervalos de tiempo de 0.1 segundos. 
         * @method ProximoPunto
         * @return Retona en el lienzo punto por punto la parabola, dibujanco cada punto con un delay de 0.1
         * para generar la animamción.
         */
        let i = 0;
        function ProximoPunto() {
            if (i <= numSteps) {
                x = Vfx * (i * timeStep);
                y = initialY + Vfy * (i * timeStep) - 0.5 * 9.81 * Math.pow(i * timeStep, 2);
                if (y < 0) y = 0;
                canvasCoords = Coordenadas(x, y);
                ctx.lineTo(canvasCoords.x, canvasCoords.y);
                ctx.stroke();

                i++;
                setTimeout(ProximoPunto, 100);
            } else {
                marcarPuntoMedio();
            }
        }

        ProximoPunto();
    }

    Trayectoria();
}

/** 
 * Marca en el lienzo canvas la altura maxima que alcanza el proyectil.  
 * @method Calcular 
 * @return Retorna en el lienzo canvas un punto verde en el punto mas alto de la parabola. 
 */
function marcarPuntoMedio() {

    let canvas = document.querySelector("canvas");
    let ctx = canvas.getContext("2d");

    // Calcular las coordenadas del punto medio del tiempo de vuelo.
    let xMedio = (Vfx * (tiempo * 4)) + 30;
    let yMedio = altMax + 2.5;

    // Dibujar un círculo verde en el punto medio del tiempo de vuelo.
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(xMedio, canvas.height - yMedio * 8, 3, 0, 2 * Math.PI);
    ctx.fill();

    // Mostrar el texto "Punto Medio" encima del punto.
    ctx.fillStyle = "black";
    ctx.font = "10px Arial";
    ctx.fillText("Hmax", xMedio - 15, canvas.height - yMedio * 8 - 8);

    //habilita nuevamente el boton calcular.
    document.getElementById('botoncalc').disabled = false;
}

