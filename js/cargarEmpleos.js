document.addEventListener("DOMContentLoaded", function () {
    const APP_ID = "0f37637f"; // Tu APP_ID de Adzuna
    const APP_KEY = "54f601791d65f128d1249fe767ea8f69"; // Tu APP_KEY de Adzuna
    const ofertasSection = document.getElementById("lista-ofertas");
    const filtroInput = document.getElementById("ubicacion");
    const filtrarBtn = document.getElementById("filtrar");
    const siguienteBtn = document.getElementById("siguiente");
    const anteriorBtn = document.getElementById("anterior");

    let paginaActual = 1; // Página actual de resultados
    let ubicacionActual = ""; // Ubicación actual para filtrar

    // Función para cargar ofertas
    function cargarOfertas(ubicacion = "", pagina = 1) {
        // Mostrar mensaje de carga
        ofertasSection.innerHTML = "<p>Cargando ofertas...</p>";

        // Construir la URL de la API
        const API_URL = `https://api.adzuna.com/v1/api/jobs/es/search/${pagina}?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=10&where=${ubicacion}`;

        // Hacer la solicitud a la API
        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar los empleos');
                }
                return response.json();
            })
            .then(data => {
                // Limpiar el contenedor de ofertas
                ofertasSection.innerHTML = "";

                // Verificar si hay resultados
                if (data.results.length === 0) {
                    ofertasSection.innerHTML = "<p>No hay ofertas disponibles en esta ubicación.</p>";
                    return;
                }

                // Mostrar cada empleo en dos columnas
                data.results.forEach((empleo, index) => {
                    const card = `
                        <div class="col-md-6 mb-4">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h5 class="card-title">${empleo.title}</h5>
                                    <p class="card-text">
                                        <strong>Empresa:</strong> ${empleo.company.display_name}<br>
                                        <strong>Ubicación:</strong> ${empleo.location.display_name}<br>
                                        <strong>Salario:</strong> ${empleo.salary_min ? `€${empleo.salary_min}` : 'No especificado'}<br>
                                        <a href="${empleo.redirect_url}" target="_blank" class="btn btn-verde">Ver más</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    `;
                    ofertasSection.innerHTML += card;
                });

                // Habilitar o deshabilitar botones de paginación
                actualizarBotonesPaginacion(data.count);

                // Scroll automático solo al hacer clic en "Siguiente" o "Anterior"
                if (paginaActual !== 1) {
                    window.scrollTo({
                        top: ofertasSection.offsetTop - 100, // Ajuste para el menú fijo
                        behavior: "smooth" // Desplazamiento suave
                    });
                }
            })
            .catch(error => {
                // Mostrar mensaje de error
                ofertasSection.innerHTML = "<p>Error al cargar las ofertas. Inténtalo de nuevo más tarde.</p>";
                console.error('Error:', error);
            });
    }

    // Función para actualizar los botones de paginación
    function actualizarBotonesPaginacion(totalOfertas) {
        if (siguienteBtn && anteriorBtn) {
            // Deshabilitar "Anterior" si estamos en la primera página
            anteriorBtn.disabled = paginaActual === 1;

            // Deshabilitar "Siguiente" si no hay más ofertas
            siguienteBtn.disabled = paginaActual * 10 >= totalOfertas;
        }
    }

    // Cargar ofertas al inicio (sin filtro)
    cargarOfertas();

    // Filtrar ofertas al hacer clic en el botón "Filtrar"
    filtrarBtn.addEventListener("click", () => {
        const ubicacion = filtroInput.value.trim();
        if (ubicacion === "") {
            alert("Por favor, ingresa una ubicación.");
            return;
        }
        ubicacionActual = ubicacion;
        paginaActual = 1; // Reiniciar a la primera página
        cargarOfertas(ubicacion, paginaActual);
    });

    // Cargar la siguiente página de ofertas
    if (siguienteBtn) {
        siguienteBtn.addEventListener("click", () => {
            paginaActual++;
            cargarOfertas(ubicacionActual, paginaActual);
        });
    }

    // Cargar la página anterior de ofertas
    if (anteriorBtn) {
        anteriorBtn.addEventListener("click", () => {
            if (paginaActual > 1) {
                paginaActual--;
                cargarOfertas(ubicacionActual, paginaActual);
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const tarjetas = document.querySelectorAll(".servicio-card");
    const detallesServicio = document.getElementById("detalles-servicio");
    const contenidoDetalle = document.getElementById("contenido-detalle");
    const cerrarDetalle = document.getElementById("cerrar-detalle");
    const anteriorDetalle = document.getElementById("anterior-detalle");
    const siguienteDetalle = document.getElementById("siguiente-detalle");

    let servicioActual = null;
    let indiceActual = 0;

    // Datos de los servicios (descripción y fotos)
    const servicios = {
        marketing: {
            descripcion: "Ofrecemos estrategias de marketing digital personalizadas para ayudar a las pequeñas empresas a crecer.",
            fotos: ["img/marketing1.jpg", "img/marketing2.jpg", "img/marketing3.jpg"]
        },
        extranjeria: {
            descripcion: "Asesoramiento y gestión de trámites de extranjería para facilitar tu estancia en España.",
            fotos: ["img/extranjeria1.jpg", "img/extranjeria2.jpg", "img/extranjeria3.jpg"]
        },
        estudia: {
            descripcion: "Te ayudamos a encontrar programas de estudio y gestionar tu matrícula en instituciones españolas.",
            fotos: ["img/estudia1.jpg", "img/estudia2.jpg", "img/estudia3.jpg"]
        },
        trabajo: {
            descripcion: "Te ayudamos a encontrar oportunidades laborales y prepararte para entrevistas.",
            fotos: ["img/trabajo1.jpg", "img/trabajo2.jpg", "img/trabajo3.jpg"]
        },
        cv: {
            descripcion: "Creamos CV profesionales y personalizados para destacar tu perfil ante los reclutadores.",
            fotos: ["img/cv1.jpg", "img/cv2.jpg", "img/cv3.jpg"]
        }
    };

    // Abrir detalles del servicio
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener("click", function () {
            servicioActual = this.getAttribute("data-servicio");
            indiceActual = 0;
            mostrarDetalle();
            detallesServicio.classList.remove("d-none");
            document.getElementById("tarjetas-servicios").classList.add("d-none");
        });
    });

    // Cerrar detalles del servicio
    cerrarDetalle.addEventListener("click", function () {
        detallesServicio.classList.add("d-none");
        document.getElementById("tarjetas-servicios").classList.remove("d-none");
    });

    // Navegación del carrusel
    anteriorDetalle.addEventListener("click", function () {
        if (indiceActual > 0) {
            indiceActual--;
            mostrarDetalle();
        }
    });

    siguienteDetalle.addEventListener("click", function () {
        if (indiceActual < servicios[servicioActual].fotos.length - 1) {
            indiceActual++;
            mostrarDetalle();
        }
    });

    // Mostrar detalles del servicio
    function mostrarDetalle() {
        const servicio = servicios[servicioActual];
        contenidoDetalle.innerHTML = `
            <p>${servicio.descripcion}</p>
            <img src="${servicio.fotos[indiceActual]}" alt="Foto ${indiceActual + 1}" class="img-fluid">
        `;
    }
});