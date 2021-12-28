function isAuthenticated() {
    if (getToken()) {
      return true;
    } else {
      redirectToLogin();
    }
  }
  
  function getToken() {
    return localStorage.getItem("@MonitorApp:token");
  }
  
  function login(token) {
    localStorage.setItem("@MonitorApp:token", token);
  
    redirectToHome();
  }
  
  function signout() {
    fetch("/signout");
  
    redirectToLogin();
  }
  
  function redirectToHome() {
    window.location.href = "/index.html";
  }
  
  function redirectToLogin() {
    localStorage.removeItem("@MonitorApp:token");
  
    window.location.href = "/login.html";
  }
  
  export default { isAuthenticated, getToken, login, signout, redirectToHome, redirectToLogin };