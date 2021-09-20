// permet de traduire les données du sessionStorage
const listMusic = atob(sessionStorage.getItem("musics"));
const arrayList = JSON.parse(listMusic);
const lengthMusic = arrayList.length;

// récupération des éléments du sessionStorage
const type = sessionStorage.getItem("type");
const scoreLocal = sessionStorage.getItem("score");
if (!sessionStorage.getItem("pseudo")) {
  window.location = "/index.html";
}
// récupérer élément du DOM
const titleTable = document.getElementById("titleTable");
const pseudo = document.getElementById("pseudo");
const score = document.getElementById("score");
const scoreUser = document.getElementById("scoreUser");
const audioButton = document.getElementById("audioButton");

// Implémenter des éléments dans le DOM
scoreUser.innerHTML = `Ton score est de ${scoreLocal}/${lengthMusic}`;
titleTable.innerHTML = `Les scores des autres Kelziqueurs avec ${lengthMusic} musiques pour la catégorie
          "${type}" sont :`;

function scoreDb(number, type) {
  const data = JSON.stringify({ number, type });

  fetch("http://localhost:3000/api/scores/recover", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "content-type": "application/json",
    },
    body: data,
  }).then(async (responseScore) => {
    const response = await responseScore.json();
    response.sort((a, b) => b.score - a.score);
    const tbody = document.getElementById("tbody");
    response.forEach((Score) => {
      const trElement = document.createElement("tr");
      trElement.classList.add("dbScore");
      trElement.innerHTML = `
        <td class="pseudo">${Score.username}</td>
        <td class="score">${Score.score}</td>
      `;
      tbody.appendChild(trElement);
    });
  });
}
scoreDb(lengthMusic, type);

const returnButton = document.getElementById("returnButton");

returnButton.addEventListener("click", () => {
  audioButton.play();
  sessionStorage.removeItem("score");
  sessionStorage.removeItem("type");
  sessionStorage.removeItem("musics");
  window.location = "category.html";
});
