const arrowReturn = document.getElementById("return");
const buttonReady = document.getElementById("buttonReady");
const audioButton = document.getElementById("audioButton");
const alertUser = document.getElementById("alertUser");
const username = document.getElementById("username");
const inscriptionPage = document.getElementById("inscriptionPage");
const emailSend = document.getElementById("emailSend");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordValidate = document.getElementById("passwordValidate");
const inputSignup = document.getElementsByClassName("login");
arrowReturn.addEventListener("click", () => (window.location = "/index.html"));

function signupUser(username, email, password, passwordValidate) {
  if (password != passwordValidate) {
    document.getElementById("password").value = "";
    document.getElementById("passwordValidate").value = "";
    alertUser.innerHTML =
      /* html */
      `
    <p>le mot de passe et le mot de passe de validation sont différents</p>
    `;
  } else {
    const data = JSON.stringify({ username, email, password });
    fetch(config.apiUrl + "/api/names/signup", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: data,
    })
      .then(async (response) => {
        await response.json();
        const passwordReset = (document.getElementById("password").value = "");
        const passwordValidateReset = (document.getElementById(
          "passwordValidate"
        ).value = "");
        if (response.status === 201) {
          inscriptionPage.style.display = "none";
          emailSend.style.display = "flex";
        } else if (response.status === 401) {
          passwordReset;
          passwordValidateReset;
          alertUser.innerHTML =
            /* html */
            `
            <p>le mot de passe n'est pas valide</p>
            `;
        } else if (response.status === 406) {
          passwordReset;
          passwordValidateReset;
          alertUser.innerHTML =
            /*html*/
            `<p>Cette adresse mail existe déjà</p>`;
        } else if (response.status === 418) {
          passwordReset;
          passwordValidateReset;
          alertUser.innerHTML =
            /*html*/
            `<p>Ce pseudo est déjà utilisé par un autre joueur</p>`;
        } else if (response.status === 408) {
          passwordReset;
          passwordValidateReset;
          alertUser.innerHTML =
            /*html*/
            `<p>Cette adresse mail et ce pseudo existe déjà</p>`;
        } else {
          passwordReset;
          passwordValidateReset;
          alertUser.innerHTML =
            /*html*/
            `<p>Il faut remplir correctement tous les champs ;)</p>`;
        }
      })
      .catch(() => console.log("error"));
  }
}

function buttonSignup(e) {
  e.preventDefault();
  e.stopPropagation();
  // on déclenche une musique au click
  audioButton.play();
  // On récupère les données dans les inputs
  const Username = username.value.trim();
  const Email = email.value.trim();
  const Password = password.value.trim();
  const PasswordValidate = passwordValidate.value.trim();
  signupUser(Username, Email, Password, PasswordValidate);
}

function enterEvent(inputEvent, focusInput) {
  inputEvent.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      focusInput.focus((e) => {
        eventButton(e);
      });
    }
  });
}
enterEvent(username, email);
enterEvent(email, password);
enterEvent(password, passwordValidate);

passwordValidate.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    e.preventDefault();
    buttonReady.click((e) => {
      eventButton(e);
    });
  }
});

buttonReady.addEventListener("click", (e) => {
  buttonSignup(e);
});

function alert() {
  alertUser.innerHTML = /*html*/ ``;
}
email.addEventListener("click", () => {
  alert();
});

password.addEventListener("click", () => {
  alert();
});

passwordValidate.addEventListener("click", () => {
  alert();
});

username.addEventListener("click", () => {
  alert();
});
