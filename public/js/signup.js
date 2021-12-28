import api from './services/api.js';
import Auth from './services/auth.js';

const form = document.querySelector('form');

form.onsubmit = async (e) => {
  e.preventDefault();

  try {
    const user = Object.fromEntries(new FormData(form));

    await api.create('signup', user, false);

    Auth.redirectToLogin();
  } catch (error) {
    showToast("Signup Error.");
  }
};

function showToast(message) {
  document.querySelector(".toast-header strong").innerText = message;

  const toastElem = document.querySelector(".toast");

  const toast = new bootstrap.Toast(toastElem)

  toast.show();
}