const datepicker = document.querySelector('#date-picker');
const programsContainer = document.querySelector('#programsContainer');

datepicker.addEventListener('change', () => getData(datepicker.value));

let tvPrograms = [];

async function getData(date) {
  const PROXY = 'https://cors-anywhere.herokuapp.com/';
  const API_URL = `https://api-programacao-rpc.herokuapp.com/rpc/cronograma/${date}`;
  let data = [];

  programsContainer.innerHTML = `
    <div class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Carregando...</span>
      </div>
    </div>
  `;

  data = await fetch(API_URL);
  dataJSON = await data.json();

  console.log(dataJSON.data);

  if (Object.keys(dataJSON.data).length > 0) {
    tvPrograms = [...dataJSON.data].map((tvProgram) => {
      return {
        id: tvProgram.media_id,
        title: tvProgram.title,
        category: tvProgram.program.category,
        start_time: tvProgram.start_time,
        end_time: tvProgram.end_time,
        duration_in_minutes: tvProgram.duration_in_minutes,
        logoURL: tvProgram.custom_info.Graficos.LogoURL,
        imgURL: tvProgram.custom_info.Graficos.ImagemURL,
        sinopse: tvProgram.custom_info.Resumos.Sinopse || tvProgram.description,
      };
    });
  } else {
    tvPrograms = {
      message: 'Não há programação para esta data.',
    };
  }

  renderTvPrograms();
}

function getTime(timestamp) {
  return new Date(timestamp * 1000).toTimeString().slice(0, 5);
}

function renderTvPrograms() {
  programsContainer.innerHTML = '';

  if (tvPrograms.message) {
    programsContainer.innerHTML = `
      <div class="alert alert-warning" role="alert">
        ${tvPrograms.message}
      </div>
    `;
  } else {
    tvPrograms.forEach((program) => {
      let html = `
        <div class="card">
        <div class="card-header" id="${program.id}">
          <h2 class="mb-0">
            <button
              class="btn btn-block text-left text-decoration-none collapsed"
              type="button"
              data-toggle="collapse"
              data-target="#collapse${program.id}"
              aria-expanded="false"
              aria-controls="collapse${program.id}"
            >
              <span>
                <img class="rounded mr-3" src="${program.logoURL}" alt="" />
              </span>
              <span class="badge badge-light border mr-3 p-2">${getTime(
                program.start_time
              )}</span>
              ${program.title}
            </button>
          </h2>
        </div>
  
        <div
          id="collapse${program.id}"
          class="collapse"
          aria-labelledby="${program.id}"
          data-parent="#programsContainer"
        >
          <div class="card-body">
            <div class="row">
              <div class="col-6">
                <p>
                  ${program.sinopse}
                </p>
                <hr />
                <p class="badge badge-light border mr-3 p-2">Categoria: ${
                  program.category
                }</p>
                <p class="badge badge-light border mr-3 p-2">Duração: ${
                  program.duration_in_minutes
                } minutos</p>
              </div>
              <div class="col-6">
                <img src="${program.imgURL}" alt="" class="rounded img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </div>
      `;

      programsContainer.insertAdjacentHTML('beforeend', html);
    });
  }
}

const today = new Date().toISOString().split('T')[0];
datepicker.value = today;
getData(today);
