const buttonReady = document.getElementById("buttonReady");
const audioButton = document.getElementById("audioButton");
const alertUser = document.getElementById("alertUser");
const email = document.getElementById("email");
const password = document.getElementById("password");
const guest = document.getElementById("guest");

// On vérifie si l'user existe déjà dans la db
function loginUser(email, password) {
  const data = JSON.stringify({ email, password });
  fetch(config.apiUrl + "/api/names/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: data,
  })
    .then(async (response) => {
      let apiData = await response.json();

      // Alerte si compte pas actif
      if (response.status === 400) {
        alertUser.innerHTML =
          /*html*/
          `<p>Ton compte n'a pas été activé, vérifie ta boite mail</p>`;
        document.getElementById("password").value = "";
        // Alerte si l'email n'existe pas
      } else if (response.status === 500 || response.status === 401) {
        alertUser.innerHTML =
          /*html*/
          `<p>L'email ou le mot de passe est erroné</p>`;
        document.getElementById("password").value = "";
      } else {
        sessionStorage.setItem("pseudo", apiData.username);
        sessionStorage.setItem("token", apiData.token);
        sessionStorage.setItem("userId", apiData.userId);
        window.location = "./assets/html/category.html?id=" + apiData.userId;
      }
    })
    .catch(() => console.log("error"));
}

function eventButton(e) {
  e.preventDefault();
  e.stopPropagation();
  // on declenche une musique au click
  audioButton.play();
  // On récupere le nom écrit par l'user dans l'input
  const Email = email.value.trim();
  const Password = password.value.trim();
  loginUser(Email, Password);
}

email.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    e.preventDefault();
    password.focus((e) => {
      eventButton(e);
    });
  }
});

password.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    e.preventDefault();
    buttonReady.click((e) => {
      eventButton(e);
    });
  }
});

buttonReady.addEventListener("click", (e) => {
  eventButton(e);
});

//jouer en tant qu'inviter
guest.addEventListener("click", () => {
  const guestRandom = "Zicos" + Math.floor(Math.random() * 10000) + 100;
  sessionStorage.setItem("pseudo", guestRandom);
  document.location = "./assets/html/category.html";
});

// Au click sur l'input, on retire le message d'erreur
function alertStop() {
  alertUser.innerHTML = /*html*/ ``;
}
email.addEventListener("click", () => {
  alertStop();
});
password.addEventListener("click", () => {
  alertStop();
});
sessionStorage.clear();
