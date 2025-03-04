document.addEventListener("DOMContentLoaded", function () {
    const tarjetas = document.querySelectorAll(".servicio-card");

    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener("click", function () {
            const servicio = this.getAttribute("data-servicio");
            const seccionDetalle = document.getElementById(`${servicio}-detalle`);

            document.querySelectorAll(".servicio-detalle").forEach(seccion => {
                seccion.classList.add("d-none");
            });

            if (seccionDetalle) {
                seccionDetalle.classList.remove("d-none");

                const offset = 100; // Ajusta este valor
                const seccionPosicion = seccionDetalle.offsetTop - offset;

                window.scrollTo({
                    top: seccionPosicion,
                    behavior: "smooth"
                });
            }
        });
    });
});