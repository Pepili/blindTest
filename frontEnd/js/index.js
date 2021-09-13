const regex =
  /^[a-zA-Z1-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ' -]{2,20}$/;
const buttonReady = document.getElementById("buttonReady");
const audioButton = document.getElementById("audioButton");
const alertUser = document.getElementById("alertUser");
const pseudo = document.getElementById("pseudo");
buttonReady.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  audioButton.play();
  const username = pseudo.value.trim();
  if (!regex.test(username)) {
    alert(
      "Ton pseudo n'est pas valide, il doit contenir au minimum 2 caractères et au maximum 20..."
    );
    return;
  }

  const data = JSON.stringify({ username });
  fetch("http://localhost:3000/api/names/signup", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: data,
  })
    .then(async (response) => {
      await response.json();
      if (response.status === 500) {
        pseudo.value = "";
        alertUser.style.display = "block";
      } else {
        localStorage.setItem("pseudo", username);
        window.location = "./assets/html/category.html";
      }
    })
    .catch(() => console.log("error"));
});
pseudo.addEventListener("click", () => {
  alertUser.style.display = "none";
});
localStorage.clear();
