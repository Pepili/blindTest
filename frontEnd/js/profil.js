const token = "Bearer " + sessionStorage.getItem("token");
const pseudo = sessionStorage.getItem("pseudo");
const infoProfilUser = document.getElementById("infoProfilUser");
const arrowReturn = document.getElementById("return");
const url = new URLSearchParams(document.location.search);
const id = url.get("id");
const modifyLi = document.getElementById("modifyLi");
const scoreLi = document.getElementById("scoreLi");
const alertUser = document.getElementById("alertUser");
const profilUserInfo = document.getElementById("profilUserInfo");
const modifyUser = document.getElementById("modifyUser");
const buttonReady = document.getElementById("buttonReady");
const logout = document.getElementById("logout");
const deleteUser = document.getElementById("delete");
const withScore = document.getElementById("withScore");
const Username = document.getElementById("userName");
const Email = document.getElementById("email");
const Password = document.getElementById("password");
const PasswordValidate = document.getElementById("passwordValidate");
modifyLi.addEventListener("click", () => {
  profilUserInfo.style.display = "none";
  modifyUser.style.display = "flex";
});

scoreLi.addEventListener("click", () => {
  profilUserInfo.style.display = "block";
  modifyUser.style.display = "none";
});

arrowReturn.addEventListener(
  "click",
  () => (window.location = "category.html?id=" + id)
);
function getProfil() {
  if (id === null) {
    alert("Désolé, vous n'avez pas accès à ce profil");
    window.location = "category.html";
  } else {
    fetch(config.apiUrl + "/api/names/" + id, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
    }).then(async (response) => {
      const apiData = await response.json();
      infoProfilUser.innerHTML = /* html */ `
       <div><p class="infoStyle">Pseudo:</p><p>${apiData.username}</p></div>  
        <div><p class="infoStyle">Email:</p><p> ${apiData.email}</p></div>
        
      `;
      const data = JSON.stringify({ userId: id });
      fetch(config.apiUrl + "/api/names/:id/scores", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
          Authorization: token,
        },
        body: data,
      })
        .then(async (responseScore) => {
          const responseScoreData = await responseScore.json();
          const arrayScore = responseScoreData.message;
          const noScore = document.getElementById("noScore");
          if (arrayScore.length === 0) {
            noScore.innerHTML = /*html*/ `
              Tu n'as pas encore obtenu de score, il faudrait peut être commencer à jouer!
            `;
          } else {
            if (arrayScore.length >= 6) {
              withScore.style.overflowY = "scroll";
            }
            noScore.style.display = "none";
            const tbody = document.getElementById("tbody");
            arrayScore.forEach((Score) => {
              withScore.style.display = "block";
              const trElement = document.createElement("tr");
              trElement.classList.add("dbScore");
              trElement.innerHTML = `
               <td class="type">${Score.type}</td>
               <td class="score">${Score.score}</td>
               <td class="date">${Score.createAt}</td>
            `;
              tbody.appendChild(trElement);
            });
          }
        })
        .catch((err) => console.log(err));
    });
  }
}

function modifyProfil() {
  const username = Username.value || pseudo;
  const email = Email.value || undefined;
  const password = Password.value || undefined;
  const passwordValidate = PasswordValidate.value || undefined;
  if (password != undefined && passwordValidate === undefined) {
    alertUser.innerHTML =
      /* html */
      `<p>veuillez remplir le champ de validation de mot de passe</p>`;
  } else if (password != passwordValidate) {
    alertUser.innerHTML =
      /* html */
      `<p>Les mots de passe sont différents, veuillez réessayer</p>`;
  } else if (
    password != undefined &&
    passwordValidate != undefined &&
    password === passwordValidate
  ) {
    const dataPassword = JSON.stringify({ userId: id, password: password });
    fetch(config.apiUrl + "/api/names/:id/password", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
        Authorization: token,
      },
      body: dataPassword,
    }).then(async (response) => {
      await response.json();
      console.log("Changement de mot de passe");
    });
  }
  let data;
  if (email === undefined) {
    data = JSON.stringify({
      userId: id,
      username: username,
      email: email,
    });
  } else {
    data = JSON.stringify({
      userId: id,
      username: username,
      email: email,
      status: "Pending",
    });
  }
  if (
    (username != pseudo || email != undefined) &&
    password === passwordValidate
  ) {
    fetch(config.apiUrl + "/api/names/:id", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
        Authorization: token,
      },
      body: data,
    }).then(async (res) => {
      await res.json();
      if (res.status === 200) {
        if (email === undefined) {
          alertUser.innerHTML =
            /* html */
            `<p>Modification sauvegardé</p>`;
        } else {
          alertUser.innerHTML =
            /* html */
            `<p>Modification sauvegardé (veuillez confirmer votre adresse email)</p>`;
        }
      } else {
        alertUser.innerHTML =
          /* html */
          `<p>La modification n'a pas pu aboutir, veuillez réessayer</p>`;
      }
    });
  }
}

function logoutAccount() {
  sessionStorage.removeItem("token");
  alert("Vous vous êtes déconnecté!");
  window.location = "/index.html";
}

function deleteAccount() {
  const dataDelete = JSON.stringify({ userId: id });
  console.log(dataDelete);
  fetch(config.apiUrl + "/api/names/:id", {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: token,
      body: dataDelete,
    },
  })
    .then(() => {
      alert("Compte Supprimé");
      /* window.location = "/index.html"; */
    })
    .catch(() => {
      alert("suppression impossible");
    });
}
buttonReady.addEventListener("click", () => {
  modifyProfil();
});
logout.addEventListener("click", () => {
  logoutAccount();
});
deleteUser.addEventListener("click", () => {
  if (
    window.confirm(
      `Es-tu sûr de vouloir supprimer ton compte? tu perdras alors toutes tes données et tes scores. Si c'est vraiment ce que tu veux clique sur OK sinon clique sur ANNULER`
    )
  ) {
    deleteAccount();
  }
});
function alertStop() {
  alertUser.innerHTML =
    /* html */
    ``;
}
Password.addEventListener("click", () => {
  alertStop();
});
PasswordValidate.addEventListener("click", () => {
  alertStop();
});
Email.addEventListener("click", () => {
  alertStop();
});
Username.addEventListener("click", () => {
  alertStop();
});
getProfil();
