document.addEventListener("DOMContentLoaded", function () {
    const tarjetas = document.querySelectorAll(".servicio-card");

    // Efecto hover en tarjetas
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener("mouseenter", () => {
            tarjeta.style.transform = "scale(1.05)";
            tarjeta.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
            tarjeta.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        });

        tarjeta.addEventListener("mouseleave", () => {
            tarjeta.style.transform = "scale(1)";
            tarjeta.style.boxShadow = "none";
        });
    });

    // Abrir detalles del servicio
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener("click", function () {
            const servicio = this.getAttribute("data-servicio");
            const seccionDetalle = document.getElementById(`${servicio}-detalle`);

            // Ocultar todas las secciones de detalles
            document.querySelectorAll(".servicio-detalle").forEach(seccion => {
                seccion.classList.add("d-none");
            });

            // Mostrar la sección de detalles correspondiente
            if (seccionDetalle) {
                seccionDetalle.classList.remove("d-none");

                // Ajustar el desplazamiento para que el título sea visible
                const offset = 100; // Ajusta este valor según la altura de tu barra de navegación
                const seccionPosicion = seccionDetalle.offsetTop - offset;

                window.scrollTo({
                    top: seccionPosicion,
                    behavior: "smooth"
                });

                // Resaltar la tarjeta seleccionada
                tarjetas.forEach(t => t.classList.remove("seleccionada"));
                this.classList.add("seleccionada");
            }
        });
    });

    // Cerrar la sección de detalles al hacer clic en "Volver a servicios"
    document.querySelectorAll(".btn-secondary").forEach(boton => {
        boton.addEventListener("click", function (event) {
            event.preventDefault(); // Evita el comportamiento predeterminado del enlace

            // Ocultar todas las secciones de detalles
            document.querySelectorAll(".servicio-detalle").forEach(seccion => {
                seccion.classList.add("d-none");
            });

            // Desplazarse suavemente a la sección de servicios
            const seccionServicios = document.getElementById("servicios");
            if (seccionServicios) {
                const offset = 100; // Ajusta este valor según la altura de tu barra de navegación
                const seccionPosicion = seccionServicios.offsetTop - offset;

                window.scrollTo({
                    top: seccionPosicion,
                    behavior: "smooth"
                });
            }
        });
    });
});

// Animación de la barra de navegación al hacer scroll
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.querySelector("form[name='contact']");

    formulario.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita que el formulario se envíe de manera tradicional

        // Oculta el formulario
        formulario.classList.add("d-none");

        // Muestra la sección de "Gracias"
        document.getElementById("gracias").classList.remove("d-none");

        // Envía el formulario a Netlify
        fetch("/", {
            method: "POST",
            body: new FormData(formulario),
        })
        .then(response => {
            if (response.ok) {
                console.log("Formulario enviado correctamente");
            } else {
                console.error("Error al enviar el formulario");
            }
        })
        .catch(error => {
            console.error("Error de red:", error);
        });
    });
});
