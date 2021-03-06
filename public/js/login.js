import api from "./services/api.js";
import Auth from "./services/auth.js";

const form = document.querySelector("form");

form.onsubmit = async (event) => {
  event.preventDefault();

  try {
    const user = Object.fromEntries(new FormData(form));

    const { auth, token } = await api.create("login", user, false);

    if (auth) {
      Auth.login(token);
    }
  } catch (error) {
    showToast("Login Error.");
  }
};

function showToast(message) {
  document.querySelector(".toast-header strong").innerText = message;

  const toastElem = document.querySelector(".toast");

  const toast = new bootstrap.Toast(toastElem)

  toast.show();
}
