import api from './services/api.js';
import Auth from './services/auth.js';

let chart;

loadHosts();

/* createChart() */

handleSubmitNewHost();

window.destroyHost = destroyHost;

window.loadChart = loadChart;

window.signout = Auth.signout;

async function loadHosts() {
  const hosts = await api.read('hosts');

  for (const {id, name, address} of hosts) {
    createHostRow(id, name, address);
  }
}

function createHostRow(id, name, address) {
  const view = `<tr class="host" id="host-${id}">
    <td>${name}</td>
    <td>${address}</td>
    <td>
      <div class="d-flex justify-content-between">
        <i class="far fa-trash-alt" onclick="destroyHost(${id})"></i>
        <i class="fas fa-door-open">
          <button onclick="Function()">SSH</button>
        </i>
        <div class="spinner-border spinner-border-sm invisible" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </td>
  </tr>`;

  const tbody = document.querySelector('tbody');

  tbody.insertAdjacentHTML('beforeend', view);
}

async function destroyHost(id) {
  try {
    api.destroy(`hosts/${id}`);

    const hostRow = document.querySelector(`#host-${id}`);

    hostRow.remove();
  }  catch (error) {
    showToast("Destory Error.");
  }
}

function handleSubmitNewHost() {
  const form = document.querySelector('form');

  const myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
    keyboard: false
  });

  form.onsubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = Object.fromEntries(new FormData(form));

      const {id, name, address} = await api.create('hosts', formData);

      createHostRow(id, name, address);

      form.reset();

      myModal.hide();
    } catch (error) {
      showToast("Create Error.");
    }
  }
}

