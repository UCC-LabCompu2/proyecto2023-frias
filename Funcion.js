function Calcular() {
    var Vi = parseFloat(document.getElementById("velocidad_inicial").value);
    var Ang = parseFloat(document.getElementById("angulo_salida").value);

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
                alert("No ingrese un valor mayor a 89 en el angulo de salida");

            } else {
                var ang_r = Ang * (Math.PI / 180);
                var Vfx = Vi * Math.cos(ang_r);
                var Vfy = Vi * Math.sin(ang_r);

                var Vf = Math.sqrt(Math.pow(Vfx, 2) + Math.pow(Vfy, 2));
                document.getElementById("velocidad_final").textContent = Vf.toFixed(2);

                var tiempo = (2 * Vfy) / 9.81;
                document.getElementById("tiempo").textContent = tiempo.toFixed(2);

                var altura_maxima = Math.pow(Vfy, 2) / (2 * 9.81);
                document.getElementById("altura_maxima").textContent = altura_maxima.toFixed(2);

                var distancia_x = Vfx * tiempo;
                document.getElementById("distancia_x").textContent = distancia_x.toFixed(2);
            }
        }
    }
}
