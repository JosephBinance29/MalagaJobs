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