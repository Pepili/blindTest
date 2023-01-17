const startButtonMusic = document.getElementById("startButtonMusic");
const audioButton = document.getElementById("audioButton");
const scriptCategory = document.getElementById("scriptCategory");
const startMusic = document.getElementById("startMusic");
const checkDiv = document.getElementById("checkDiv");
const rangeValue = document.getElementById("rangeValue");
const crossCheck = document.getElementById("crossCheck");
const crossCheck2 = document.getElementById("crossCheck2");
const checkDiv2 = document.getElementById("checkDiv2");
const myRange = document.getElementById("myRange");
const cross = document.getElementById("cross");
const namePlayer = document.getElementById("namePlayer");
const categoryButtonMusic = document.getElementById("categoryButtonMusic");
const categoryButtonMusic2 = document.getElementById("categoryButtonMusic2");
const accessProfil = document.getElementById("accessProfil");
const types = [];
const kinds = [];
const pseudoUser = sessionStorage.getItem("pseudo");
const idUser = sessionStorage.getItem("userId");
sessionStorage.removeItem("score");
sessionStorage.removeItem("type");
sessionStorage.removeItem("musics");
document.getElementById("alertMessageCheck").style.display = "none";

if (!pseudoUser) {
  alert("il faut te connecter d'abord avant de jouer!");
  window.location = "/index.html";
}

//on vérifie si l'user joue en tant que guest ou s'est connecté afin d'adapter l'affichage
if (!idUser) {
  accessProfil.innerHTML = /* html */ `
    <p class="titleGuestPseudo">Pseudo:</p>
    <p class="guestPseudo">${pseudoUser}</p>
  `;
} else {
  accessProfil.innerHTML = /* html */ `
    <p class="titleGuestPseudo userSubscribe">${pseudoUser}</p>
    <a href="profil.html?id=${idUser}" class="guestPseudo linkPageProfil">Accéder à ton profil</a>
  `;
}
const inputCheck = document.querySelectorAll("#checkType > p > input");
const inputCheck2 = document.querySelectorAll("#checkType2 > p > input");
// permet de faire apparaitre la valeur sélectionnée en cours sur le range
function rangeSlide(value) {
  rangeValue.innerHTML = value;
}

namePlayer.innerHTML = /*html*/ `
  <h1>Salut ${sessionStorage.getItem("pseudo")},</h1>
`;
/* Au click sur le bouton C'est parti, on fait une req post pour récuperer 
     des musiques en fct de la catégorie et au nombre sélectionné par l'utilisateur */
function musicCategory(types, type, kinds) {
  startButtonMusic.addEventListener("click", (e) => {
    audioButton.play();
    // On récupère le nombre du range
    const valueRange = myRange.value;
    let data;
    sessionStorage.setItem("type", type);
    if (type == "Toute Catégories") {
      data = JSON.stringify({
        random: parseInt(valueRange),
        types,
      });
    } else if (type == "Mangas") {
      data = JSON.stringify({
        random: parseInt(valueRange),
        kinds,
      });
    } else {
      data = JSON.stringify({ random: parseInt(valueRange), types: [type] });
    }
    // On fait la requete pour récupérer les musiques
    fetch(config.apiUrl + "/api/musics/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
      },
      body: data,
    })
      .then(async (responseButton) => {
        const response = await responseButton.json();
        // Si la requête réussie, on crypte les données et on les ajoutent au sessionStorage
        sessionStorage.setItem("musics", btoa(JSON.stringify(response)));
        if (idUser === null) {
          window.location = "music.html";
        } else {
          window.location = "music.html?id=" + idUser;
        }
      })
      .catch((err) => console.log(err));
  });
}

// Ajout length music dans range
async function rangeMusic(response, type) {
  const responseMusic = await response.json();
  /* ---------- Implémentation du nb maximum de musique dans l'input range ------------- */
  const responseLength = JSON.stringify(responseMusic.length);
  myRange.setAttribute("max", responseLength);

  // On ajoute dans titre le nom du type du li
  document.getElementById("titleCategoryMusic").innerHTML = type;
}

// On fait apparaitre le block choix du nb de musique
async function clickCategory(response, types, type) {
  rangeMusic(response, type);
  // On fait apparaitre le block startMusic et on fait disparaitre le block scriptCategory
  startMusic.style.display = "block";
  scriptCategory.style.display = "none";

  // On inverse les effets des styles précédents au click sur la croix

  cross.addEventListener("click", () => {
    startMusic.style.display = "none";
    scriptCategory.style.display = "block";
    myRange.value = "10";
    rangeValue.innerHTML = myRange.value;
    audioButton.play();
  });
  musicCategory(types, type);
}

// On fait apparaitre le block choix des catégories
function allCategory(type) {
  checkDiv.style.display = "block";
  scriptCategory.style.display = "none";

  // On ajoute dans titre le nom du type du li
  document.getElementById("titleCategoryMusicCheck").innerHTML = type;

  // On inverse les effets des styles précédents au click sur la croix
  crossCheck.addEventListener("click", () => {
    checkDiv.style.display = "none";
    scriptCategory.style.display = "block";
    inputCheck.forEach((a) => {
      if ((a.checked = true)) {
        a.checked = false;
      }
    });
    types.splice(0, types.length);
    myRange.value = "10";
    rangeValue.innerHTML = myRange.value;
    audioButton.play();
  });
}

// On fait apparaitre le block choix du type de mangas
function allMangas(type) {
  checkDiv2.style.display = "block";
  scriptCategory.style.display = "none";
  document.getElementById("titleCategoryMusicCheck2").innerHTML = type;
  // On inverse les effets des styles précédents au click sur la croix
  crossCheck2.addEventListener("click", () => {
    checkDiv2.style.display = "none";
    scriptCategory.style.display = "block";
    inputCheck2.forEach((a) => {
      if ((a.checked = true)) {
        a.checked = false;
      }
    });
    kinds.splice(0, kinds.length);
    myRange.value = "10";
    rangeValue.innerHTML = myRange.value;
    audioButton.play();
  });
}

// On calcule le total des musiques des types choisies
async function allMusicMangas(response, types, type, kinds) {
  const responseMusic = await response.json();
  myRange.setAttribute("max", responseMusic.length);
  // On fait apparaitre le block startMusic et on fait disparaitre le block scriptCategory
  startMusic.style.display = "block";
  checkDiv2.style.display = "none";
  // On ajoute dans titre le nom du type du li
  document.getElementById("titleCategoryMusicCheck2").innerHTML = type;
  // On inverse les effets des styles précédents au click sur la croix
  cross.addEventListener("click", () => {
    checkDiv2.style.display = "block";
    startMusic.style.display = "none";
    audioButton.play();
  });
  musicCategory(types, type, kinds);
}

// On calcule le total des musiques dispos des catégories choisies
async function allMusicCategory(response, types, type) {
  const responseMusic = await response.json();
  myRange.setAttribute("max", responseMusic.length);
  // On fait apparaitre le block startMusic et on fait disparaitre le block scriptCategory
  startMusic.style.display = "block";
  checkDiv.style.display = "none";
  // On ajoute dans titre le nom du type du li
  document.getElementById("titleCategoryMusicCheck").innerHTML = type;
  // On inverse les effets des styles précédents au click sur la croix
  cross.addEventListener("click", () => {
    checkDiv.style.display = "block";
    startMusic.style.display = "none";
    audioButton.play();
  });
  musicCategory(types, type);
}

/*  On ajoute un évènement au click sur chaque li afin de connaitre le nombre de musique disponible 
    en fonction du type du li */
const listCategory = document.querySelectorAll("#listCategory > li");
listCategory.forEach((e) => {
  e.addEventListener("mouseenter", () => {
    const audioCategory = document.getElementById("audioCategory");
    audioCategory.play();
  });
  e.addEventListener("click", () => {
    const type = e.getAttribute("type");
    let data;
    // On execute la requete en fonction du type
    if (type == "Toute Catégories") {
      allCategory(type);
      inputCheck.forEach((a) => {
        a.addEventListener("click", () => {
          document.getElementById("alertMessageCheck").style.display = "none";
          if (a.checked == true) {
            types.push(a.value);
          } else {
            const indexCheck = types.indexOf(a.value);
            if (indexCheck > -1) {
              types.splice(indexCheck, 1);
            } else {
              console.log("il n'y a rien qui correspond dans le tableau");
            }
          }
        });
      });
      categoryButtonMusic.addEventListener("click", () => {
        if (types.length < 2) {
          document.getElementById("alertMessageCheck").style.display = "block";
        } else {
          data = JSON.stringify({ types });
          fetch(config.apiUrl + "/api/musics/", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "content-type": "application/json",
            },
            body: data,
          })
            .then(
              async (response) => await allMusicCategory(response, types, type)
            )
            .catch((err) => console.log(err));
        }
      });
    } else if (type == "Mangas") {
      allMangas(type);
      inputCheck2.forEach((a) => {
        a.addEventListener("click", () => {
          document.getElementById("alertMessageCheck2").style.display = "none";
          if (a.checked == true) {
            kinds.push(a.value);
          } else {
            const indexCheck = kinds.indexOf(a.value);
            if (indexCheck > -1) {
              kinds.splice(indexCheck, 1);
            } else {
              console.log("il n'y a rien qui correspond dans le tableau");
            }
          }
        });
      });
      categoryButtonMusic2.addEventListener("click", () => {
        if (kinds.length == 0) {
          document.getElementById("alertMessageCheck2").style.display = "block";
        } else {
          data = JSON.stringify({
            kinds,
          });
          fetch(config.apiUrl + "/api/musics/", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "content-type": "application/json",
            },
            body: data,
          })
            .then(
              async (response) =>
                await allMusicMangas(response, types, type, kinds)
            )
            .catch((err) => console.log(err));
        }
      });
    } else {
      data = JSON.stringify({ types: [type] });
      fetch(config.apiUrl + "/api/musics/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
        },
        body: data,
      })
        .then(async (response) => await clickCategory(response, types, type))
        .catch((err) => console.log(err));
    }
  });
});
