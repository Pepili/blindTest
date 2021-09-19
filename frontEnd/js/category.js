const startButtonMusic = document.getElementById("startButtonMusic");
const audioButton = document.getElementById("audioButton");
const scriptCategory = document.getElementById("scriptCategory");
const startMusic = document.getElementById("startMusic");
const checkDiv = document.getElementById("checkDiv");
const rangeValue = document.getElementById("rangeValue");
const crossCheck = document.getElementById("crossCheck");
const myRange = document.getElementById("myRange");
const cross = document.getElementById("cross");
let numberMusicArray = [];
sessionStorage.removeItem("score");
sessionStorage.removeItem("scores");
sessionStorage.removeItem("type");
sessionStorage.removeItem("musics");

// permet de faire apparaitre la valeur sélectionnée en cours sur le range
function rangeSlide(value) {
  rangeValue.innerHTML = value;
}

/* Au click sur le bouton C'est parti, on fait une req post pour récuperer 
     des musiques en fct de la catégorie et au nombre sélectionné par l'utilisateur */
function musicCategory(types) {
  startButtonMusic.addEventListener("click", () => {
    audioButton.play();
    // On récupère le nombre du range
    const valueRange = myRange.value;
    let data;
    const type = types.length == 1 ? types[0] : "Toute catégories";
    sessionStorage.setItem("type", type);
    if (types.length > 1) {
      data = JSON.stringify({
        random: parseInt(valueRange),
        types,
      });
    } else {
      data = JSON.stringify({ random: parseInt(valueRange), types });
    }
    // On fait la requete pour récupérer les musiques
    fetch("http://localhost:3000/api/musics/", {
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
        window.location = "music.html";
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
async function clickCategory(response, type) {
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
  musicCategory(type);
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
    myRange.value = "10";
    rangeValue.innerHTML = myRange.value;
    audioButton.play();
  });
}

// On envoie la req vers la db pour récupérer les musiques des catégories choisies
function allCategoryMusics(typeLabel) {
  data = JSON.stringify({ random: parseInt(valueRange), type: typeLabel });
  // On fait la requete pour récupérer les musiques
  fetch("http://localhost:3000/api/musics/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "content-type": "application/json",
    },
    body: data,
  });
}

// On calcule le total des musiques dispos des catégories choisies
async function allMusicCategory(response, types) {
  const responseMusic = await response.json();
  myRange.setAttribute("max", responseMusic.length);
  // On fait apparaitre le block startMusic et on fait disparaitre le block scriptCategory
  startMusic.style.display = "block";
  checkDiv.style.display = "none";
  // On ajoute dans titre le nom du type du li
  document.getElementById("titleCategoryMusicCheck").innerHTML =
    types.length == 1 ? types[0] : "Toute catégories";
  // On inverse les effets des styles précédents au click sur la croix
  cross.addEventListener("click", () => {
    checkDiv.style.display = "block";
    startMusic.style.display = "none";
    audioButton.play();
  });
  musicCategory(types);
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
      // recuperer value de tout les opacity 1
      const categoryButtonMusic = document.getElementById(
        "categoryButtonMusic"
      );
      const types = [];
      const inputCheck = document.querySelectorAll("#checkType > p > input");
      inputCheck.forEach((a) => {
        a.addEventListener("click", () => {
          types.push(a.value);
        });
      });
      categoryButtonMusic.addEventListener("click", () => {
        data = JSON.stringify({ types });
        fetch("http://localhost:3000/api/musics/", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "content-type": "application/json",
          },
          body: data,
        })
          .then(async (response) => await allMusicCategory(response, types))
          .catch((err) => console.log(err));
      });
    } else {
      data = JSON.stringify({ types: [type] });
      fetch("http://localhost:3000/api/musics/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
        },
        body: data,
      })
        .then(async (response) => await clickCategory(response, type))
        .catch((err) => console.log(err));
    }
  });
});
