const regex =
  /^[a-zA-Z1-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ' -]{2,20}$/;
const buttonReady = document.getElementById("buttonReady");
const audioButton = document.getElementById("audioButton");
const alertUser = document.getElementById("alertUser");
const pseudo = document.getElementById("pseudo");
const serverUrl = "51.68.45.86";
// On vérifie si l'user existe déjà dans la db
function signupUser(username) {
  const data = JSON.stringify({ username });
  fetch("http://" + serverUrl + "/api/names/signup", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: data,
  })
    .then(async (response) => {
      await response.json();
      // Si il existe déjà, on retourne un message d'erreur
      if (response.status === 500) {
        pseudo.value = "";
        alertUser.style.display = "block";
        // Sinon on ajoute le nom d'user au sessionStorage et on passe à la page suivante
      } else {
        sessionStorage.setItem("pseudo", username);
        window.location = "./assets/html/category.html";
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
  const username = pseudo.value.trim();
  if (!regex.test(username)) {
    alert(
      "Ton pseudo n'est pas valide, il doit contenir au minimum 2 caractères et au maximum 20..."
    );
    return;
  }
  signupUser(username);
}

pseudo.addEventListener("keydown", (e) => {
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

// Au click sur l'input, on retire le message d'erreur
pseudo.addEventListener("click", () => {
  alertUser.style.display = "none";
});
// On vide le sessionStorage à l'arrivé sur la page
sessionStorage.clear();
