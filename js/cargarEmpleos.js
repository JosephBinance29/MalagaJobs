document.addEventListener("DOMContentLoaded", function () {
    let e = document.getElementById("lista-ofertas"),
        r = document.getElementById("ubicacion"),
        c = document.getElementById("categoria"), // Selector de categoría
        t = document.getElementById("filtrar"),
        a = document.getElementById("siguiente"),
        s = document.getElementById("anterior"),
        n = 1,
        i = "",
        categoria = ""; // Variable para almacenar la categoría seleccionada

    // Función para cargar las categorías desde la API
    function cargarCategorias() {
        const urlCategorias = "https://api.adzuna.com/v1/api/jobs/es/categories?app_id=0f37637f&app_key=54f601791d65f128d1249fe767ea8f69";

        fetch(urlCategorias)
            .then(response => {
                if (!response.ok) throw Error(`Error ${response.status}: ${response.statusText}`);
                return response.json();
            })
            .then(data => {
                // Limpiamos el select antes de agregar las opciones
                c.innerHTML = '<option value="">Todas las categorías</option>';

                // Agregamos cada categoría como una opción en el select
                data.results.forEach(cat => {
                    let option = document.createElement("option");
                    option.value = cat.tag; // Usamos el "tag" como valor
                    option.textContent = cat.label; // Mostramos el nombre de la categoría
                    c.appendChild(option);
                });
            })
            .catch(error => {
                console.error("Error al cargar categorías:", error);
            });
    }

    // Llamamos a la función para cargar las categorías al iniciar la página
    cargarCategorias();

    // Función para buscar ofertas
    function o(r = "", t = 1, categoria = "") {
        e.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        `;

        // Construir la URL con la categoría si está seleccionada
        let url = `https://api.adzuna.com/v1/api/jobs/es/search/${t}?app_id=0f37637f&app_key=54f601791d65f128d1249fe767ea8f69&results_per_page=10&where=${r}`;
        if (categoria) {
            url += `&category=${categoria}`;
        }

        fetch(url)
            .then(response => {
                if (!response.ok) throw Error(`Error ${response.status}: ${response.statusText}`);
                return response.json();
            })
            .then(data => {
                if (e.innerHTML = "", 0 === data.results.length) {
                    e.innerHTML = "<p>No hay ofertas disponibles en esta ubicación y categoría.</p>";
                    return;
                }
                data.results.forEach(oferta => {
                    let card = `
                        <div class="col-md-6 mb-4">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h5 class="card-title">${oferta.title}</h5>
                                    <p class="card-text">
                                        <strong>Empresa:</strong> ${oferta.company?.display_name || "No especificado"}<br>
                                        <strong>Ubicación:</strong> ${oferta.location?.display_name || "No especificado"}<br>
                                        <strong>Salario:</strong> ${oferta.salary_min ? `€${oferta.salary_min}` : "No especificado"}<br>
                                        <a href="${oferta.redirect_url}" target="_blank" class="btn btn-outline-verde">Ver más</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    `;
                    e.innerHTML += card;
                });
                let total = data.count;
                a && s && (s.disabled = 1 === n, a.disabled = 10 * n >= total);
                1 !== n && window.scrollTo({ top: e.offsetTop - 100, behavior: "smooth" });
            })
            .catch(error => {
                e.innerHTML = `<p>Error: ${error.message}</p>`;
                console.error("Error:", error);
            });
    }

    // Cargar ofertas iniciales
    o();

    // Evento para el botón "Filtrar"
    t && t.addEventListener("click", () => {
        let ubicacion = r.value.trim();
        if ("" === ubicacion) {
            alert("Por favor, ingresa una ubicación.");
            return;
        }
        i = ubicacion;
        categoria = c.value; // Obtener la categoría seleccionada
        o(ubicacion, n = 1, categoria);
    });

    // Evento para el botón "Siguiente"
    a && a.addEventListener("click", () => {
        o(i, ++n, categoria);
    });

    // Evento para el botón "Anterior"
    s && s.addEventListener("click", () => {
        n > 1 && o(i, --n, categoria);
    });
});
