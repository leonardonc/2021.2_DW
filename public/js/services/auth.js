function isAuthenticated() {
    if (getToken()) {
      return true;
    } else {
      redirectToSignin();
    }
  }
  
  function getToken() {
    return localStorage.getItem("@MonitorApp:token");
  }
  
  function signin(token) {
    localStorage.setItem("@MonitorApp:token", token);
  
    redirectToHome();
  }
  
  function signout() {
    fetch("/signout");
  
    redirectToSignin();
  }
  
  function redirectToHome() {
    window.location.href = "/index.html";
  }
  
  function redirectToSignin() {
    localStorage.removeItem("@MonitorApp:token");
  
    window.location.href = "/signin.html";
  }
  
  export default { isAuthenticated, getToken, signin, signout, redirectToHome, redirectToSignin };