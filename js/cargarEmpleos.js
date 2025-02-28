document.addEventListener("DOMContentLoaded", function () {
    fetch('empleos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();
        })
        .then(data => {
            console.log("Datos cargados:", data); // Verifica que los datos se carguen
            const ofertasSection = document.getElementById("ofertas");

            if (!ofertasSection) {
                console.error("No se encontró el contenedor de ofertas");
                return;
            }

            data.forEach(empleo => {
                const card = `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">${empleo.titulo}</h5>
                            <p class="card-text">${empleo.descripcion} <a href="${empleo.enlace}">Ver más</a></p>
                        </div>
                    </div>
                `;
                ofertasSection.innerHTML += card;
            });
        })
        .catch(error => console.error('Error:', error));
});