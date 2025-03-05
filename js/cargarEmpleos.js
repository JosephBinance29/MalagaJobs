document.addEventListener("DOMContentLoaded", function () {
    const APP_ID = "0f37637f"; // Tu APP_ID de Adzuna
    const APP_KEY = "54f601791d65f128d1249fe767ea8f69"; // Tu APP_KEY de Adzuna
    const ofertasSection = document.getElementById("lista-ofertas");
    const filtroInput = document.getElementById("ubicacion");
    const filtrarBtn = document.getElementById("filtrar");
    const siguienteBtn = document.getElementById("siguiente");
    const anteriorBtn = document.getElementById("anterior");

    let paginaActual = 1;
    let ubicacionActual = "";

    // Función para cargar ofertas
    function cargarOfertas(ubicacion = "", pagina = 1) {
        ofertasSection.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        `;

        const API_URL = `https://api.adzuna.com/v1/api/jobs/es/search/${pagina}?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=10&where=${ubicacion}`;

        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                ofertasSection.innerHTML = "";

                if (data.results.length === 0) {
                    ofertasSection.innerHTML = "<p>No hay ofertas disponibles en esta ubicación.</p>";
                    return;
                }

                data.results.forEach(empleo => {
                    const card = `
                        <div class="col-md-6 mb-4">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h5 class="card-title">${empleo.title}</h5>
                                    <p class="card-text">
                                        <strong>Empresa:</strong> ${empleo.company?.display_name || "No especificado"}<br>
                                        <strong>Ubicación:</strong> ${empleo.location?.display_name || "No especificado"}<br>
                                        <strong>Salario:</strong> ${empleo.salary_min ? `€${empleo.salary_min}` : 'No especificado'}<br>
                                        <a href="${empleo.redirect_url}" target="_blank" class="btn btn-outline-verde">Ver más</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    `;
                    ofertasSection.innerHTML += card;
                });

                actualizarBotonesPaginacion(data.count);

                if (paginaActual !== 1) {
                    window.scrollTo({
                        top: ofertasSection.offsetTop - 100,
                        behavior: "smooth"
                    });
                }
            })
            .catch(error => {
                ofertasSection.innerHTML = `<p>Error: ${error.message}</p>`;
                console.error('Error:', error);
            });
    }

    // Función para actualizar los botones de paginación
    function actualizarBotonesPaginacion(totalOfertas) {
        if (siguienteBtn && anteriorBtn) {
            anteriorBtn.disabled = paginaActual === 1;
            siguienteBtn.disabled = paginaActual * 10 >= totalOfertas;
        }
    }

    // Cargar ofertas al inicio
    cargarOfertas();

    // Filtrar ofertas al hacer clic en el botón "Filtrar"
    if (filtrarBtn) {
        filtrarBtn.addEventListener("click", () => {
            const ubicacion = filtroInput.value.trim();
            if (ubicacion === "") {
                alert("Por favor, ingresa una ubicación.");
                return;
            }
            ubicacionActual = ubicacion;
            paginaActual = 1;
            cargarOfertas(ubicacion, paginaActual);
        });
    }

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
