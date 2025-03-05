document.addEventListener("DOMContentLoaded",function(){let e=document.getElementById("lista-ofertas"),r=document.getElementById("ubicacion"),t=document.getElementById("filtrar"),a=document.getElementById("siguiente"),s=document.getElementById("anterior"),n=1,i="";function o(r="",t=1){e.innerHTML=`
    <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
    </div>
`;let i=`https://api.adzuna.com/v1/api/jobs/es/search/${t}?app_id=0f37637f&app_key=54f601791d65f128d1249fe767ea8f69&results_per_page=10&where=${r}`;fetch(i).then(e=>{if(!e.ok)throw Error(`Error ${e.status}: ${e.statusText}`);return e.json()}).then(r=>{var t;if(e.innerHTML="",0===r.results.length){e.innerHTML="<p>No hay ofertas disponibles en esta ubicaci\xf3n.</p>";return}r.results.forEach(r=>{let t=`
                <div class="col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${r.title}</h5>
                            <p class="card-text">
                                <strong>Empresa:</strong> ${r.company?.display_name||"No especificado"}<br>
                                <strong>Ubicaci\xf3n:</strong> ${r.location?.display_name||"No especificado"}<br>
                                <strong>Salario:</strong> ${r.salary_min?`€${r.salary_min}`:"No especificado"}<br>
                                <a href="${r.redirect_url}" target="_blank" class="btn btn-outline-verde">Ver m\xe1s</a>
                            </p>
                        </div>
                    </div>
                </div>
            `;e.innerHTML+=t}),t=r.count,a&&s&&(s.disabled=1===n,a.disabled=10*n>=t),1!==n&&window.scrollTo({top:e.offsetTop-100,behavior:"smooth"})}).catch(r=>{e.innerHTML=`<p>Error: ${r.message}</p>`,console.error("Error:",r)})}o(),t&&t.addEventListener("click",()=>{let e=r.value.trim();if(""===e){alert("Por favor, ingresa una ubicaci\xf3n.");return}i=e,o(e,n=1)}),a&&a.addEventListener("click",()=>{o(i,++n)}),s&&s.addEventListener("click",()=>{n>1&&o(i,--n)})});
