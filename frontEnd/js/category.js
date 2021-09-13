async function clickCategory(response, type) {
  const audioButton = document.getElementById("audioButton");
  const scriptCategory = document.getElementById("scriptCategory");
  const startMusic = document.getElementById("startMusic");

  // On attend le résultat de la requete
  const responseMusic = await response.json();
  // On récupère la longueur de l'array retourné par la res de la req
  const responseLength = JSON.stringify(responseMusic.length);
  const myRange = document.getElementById("myRange");
  // On implémente la longueur au max du range
  myRange.setAttribute("max", responseLength);
  // On ajoute dans titre le nom du type du li
  document.getElementById("titleCategoryMusic").innerHTML = type;

  // On fait apparaitre le block startMusic et on fait disparaitre le block scriptCategory
  startMusic.style.display = "block";
  scriptCategory.style.display = "none";

  // On inverse les effets des styles précédents au click sur la croix
  const cross = document.getElementById("cross");
  cross.addEventListener("click", () => {
    startMusic.style.display = "none";
    scriptCategory.style.display = "block";
    audioButton.play();
  });

  /* Au click sur le bouton C'est parti, on fait une req post pour récuperer 
     des musiques en fct de la catégorie et au nombre sélectionné par l'utilisateur */
  const startButtonMusic = document.getElementById("startButtonMusic");
  startButtonMusic.addEventListener("click", () => {
    audioButton.play();
    // On récupère le nombre du range
    const valueRange = myRange.value;
    let data;
    localStorage.setItem("type", type);
    if (type == "Toute Catégories") {
      data = JSON.stringify({ random: parseInt(valueRange) });
    } else {
      data = JSON.stringify({ random: parseInt(valueRange), type });
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
        // Si la requête réussie, on crypte les données et on les ajoutent au localStorage
        const response = await responseButton.json();
        const stringResponse = JSON.stringify(response);
        const btoaResponse = btoa(stringResponse);
        localStorage.setItem("musics", btoaResponse);
        // On envoie l'utilisateur sur une nouvelle page
        window.location = "music.html";
      })
      .catch((err) => console.log(err));
  });
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
    // On récupère la value du type du li
    const type = e.getAttribute("type");
    // On execute la requete en fonction du type
    if (type == "Toute Catégories") {
      fetch("http://localhost:3000/api/musics/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
        },
      })
        .then(async (response) => await clickCategory(response, type))
        .catch((err) => console.log(err));
    } else {
      const data = JSON.stringify({ type });
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

// permet de faire apparaitre la valeur sélectionnée en cours sur le range
function rangeSlide(value) {
  document.getElementById("rangeValue").innerHTML = value;
}
localStorage.removeItem("score");
localStorage.removeItem("scores");
localStorage.removeItem("type");
