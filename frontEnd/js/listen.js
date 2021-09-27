// récupération de block par le DOM
const numberMusic = document.getElementById("numberMusic");
const resultatMessage = document.getElementById("resultatMessage");
const resultat = document.getElementById("resultat");
const lecteur = document.getElementById("lecteur");
const play = document.getElementById("play");
const pause = document.getElementById("pause");
const playerMusic = document.getElementById("playerMusic");
const musicBlind = document.getElementById("musicBlind");
const time = document.getElementById("time");
const score = document.getElementById("score");
const nextButton = document.getElementById("nextButton");
const local = "http://localhost:3000";
const audioButton = document.getElementById("audioButton");
const regexResponse =
  /^[a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ' -]{2,50}$/;
const responseButton = document.getElementById("responseButton");
const alertMessage = document.getElementById("alertMessage");
const response = document.getElementById("response");
// les données du sessionStorage
const listMusic = atob(sessionStorage.getItem("musics"));
const arrayList = JSON.parse(listMusic);
const lengthMusic = arrayList.length;
const typeLocal = sessionStorage.getItem("type");
const usernameLocal = sessionStorage.getItem("pseudo");
sessionStorage.setItem("score", "0");
if (!sessionStorage.getItem("pseudo")) {
  window.location = "/index.html";
}
// récupération des données par rapport à l'index
let index = arrayList.findIndex((i) => i);
let nameMusic;
let imageMusic;
let urlMusicList;
function indexOfMusic(i) {
  nameMusic = arrayList[i].name;
  imageMusic = arrayList[i].imageUrl;
  urlMusicList = arrayList[i].musicUrl;
  numberMusic.innerHTML = `${i + 1}/${lengthMusic}`;
  // implémenter dans le DOM l'url de la musique
  musicBlind.setAttribute("src", urlMusicList);
}
indexOfMusic(index);

function stopTime() {
  alertMessage.style.display = "none";
  clearInterval(timeId);
  index += 1;
  // permet de remettre à 0 le lecteur audio
  musicBlind.currentTime = 0;
  lecteur.style.display = "none";
  resultat.style.display = "block";
  resultatMessage.innerHTML = `
    <h2>La réponse était ${nameMusic.toUpperCase()}</h2>
    <img class="imageMusic" src="${imageMusic}" alt="${nameMusic}"/>
    <p>Dommage, tu feras mieux à la prochaine !</p>
  `;
  if (arrayList.length === index) {
    score.style.display = "block";
    nextButton.style.display = "none";
  }
  nextButton.focus();
}
// cette fonction permet d'afficher le minuteur et de le faire fonctionner
let timeLeft;
let timeId;
function timeSecond() {
  timeLeft = 59;
  timeId = setInterval(() => {
    if (timeLeft == 0) {
      musicBlind.pause();
      stopTime();
    } else {
      // permet d'afficher correctement le minuteur
      if (timeLeft < 10) {
        time.innerHTML = "00:0" + timeLeft;
      } else {
        time.innerHTML = "00:" + timeLeft;
      }
      timeLeft--;
    }
  }, 1000);
}

// Evenement au click sur le bouton validé
function clickResponse(e) {
  e.preventDefault();
  e.stopPropagation();
  const valueResponse = response.value
    .toLowerCase()
    .trim()
    .replace(/[-]/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f,:]/g, "");
  if (
    !regexResponse.test(valueResponse) ||
    valueResponse == "" ||
    valueResponse != nameMusic
  ) {
    alertMessage.style.display = "block";
    response.value = "";
  } else if (valueResponse === nameMusic) {
    lecteur.style.display = "none";
    musicBlind.pause();
    clearInterval(timeId);
    let scoreAddsessionStorage = JSON.parse(sessionStorage.getItem("score"));
    const numberScore = Number(scoreAddsessionStorage);
    const resultatScore = numberScore + 1;
    sessionStorage.setItem("score", JSON.stringify(resultatScore));
    musicBlind.currentTime = 0;
    resultat.style.display = "block";
    resultatMessage.innerHTML = `
        <h2>Bien joué!</h2>
        <img class="imageMusic" src="${imageMusic}" alt="${nameMusic}"/>
        <p>La réponse était bien ${nameMusic.toUpperCase()}</p>
      `;
    index += 1;
    nextButton.focus();
    if (arrayList.length === index) {
      score.style.display = "block";
      nextButton.style.display = "none";
    }
  }
  response.addEventListener("click", () => {
    alertMessage.style.display = "none";
  });
}
// permet de lancer la lecture de la musique et d'activer le minuteur
play.addEventListener("click", () => {
  musicBlind
    .play()
    .then(() => {
      timeSecond();
      play.style.display = "none";
      time.style.display = "block";
      playerMusic.style.border = "0.4rem solid #4fd1c5";
    })
    .catch((err) => console.log(err));
});

response.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    e.preventDefault();
    responseButton.click((e) => {
      clickResponse(e);
    });
  }
});
// récupération de la réponse de l'utilisateur et vérification de sa véracité
responseButton.addEventListener("click", (e) => {
  clickResponse(e);
});

nextButton.addEventListener("click", () => {
  audioButton.play();
  lecteur.style.display = "block";
  resultat.style.display = "none";
  play.style.display = "block";
  time.style.display = "none";
  playerMusic.style.border = "0.2rem solid #f7ff3c";
  time.innerHTML = `01:00`;
  response.value = "";
  indexOfMusic(index);
});

function recordScore(username, type, number, score) {
  const data = JSON.stringify({ username, type, number, score });
  // On ajoute à la db le score de l'user
  fetch(local + "/api/scores/", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: data,
  })
    .then(async (responseUserScore) => {
      await responseUserScore.json();
      const scoreLocal = Number(sessionStorage.getItem("score"));
      if (responseUserScore.status === 201 && scoreLocal <= lengthMusic) {
        window.location = "score.html";
      } else {
        alert("Enregistrement du score impossible");
      }
    })
    .catch(() => console.log("error"));
}

score.addEventListener("click", () => {
  audioButton.play();
  const scoreLocal = Number(sessionStorage.getItem("score"));
  recordScore(usernameLocal, typeLocal, lengthMusic, scoreLocal);
});

const pass = document.getElementById("pass");
pass.addEventListener("click", () => {
  musicBlind.pause();
  stopTime();
});
