// Changement de mot de passe
const password = document.getElementById("password");
const alertUser = document.getElementById("alertUser");
const passwordChanged = document.getElementById("passwordChanged");
const audioButton = document.getElementById("audioButton");
const pagePassword = document.getElementById("pagePassword");
const buttonReady = document.getElementById("buttonReady");
const passwordValidate = document.getElementById("passwordValidate");
const url = new URLSearchParams(document.location.search);
const id = url.get("id");
function ChangePassword() {
  if (id === null) {
    alert("Désolé, vous n'avez pas accès à cette page");
    window.location = "/index.html";
  }
  const Password = password.value.trim();
  const PasswordValidate = passwordValidate.value.trim();
  const data = JSON.stringify({
    userId: id,
    password: Password,
  });
  function passwordReset() {
    password.value = "";
    passwordValidate.value = "";
  }
  if (Password != PasswordValidate) {
    passwordReset();
    alertUser.innerHTML =
      /*html*/
      `<p>le mot de passe et le mot de passe de validation sont différents</p>`;
  } else {
    fetch(config.apiUrl + "/api/names/:id/password", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: data,
    }).then(async (response) => {
      await response.json();
      if (response.status === 400) {
        passwordReset();
        alertUser.innerHTML =
          /*html*/
          `<p>le mot de passe n'est pas valide</p>`;
      } else if (response.status === 200) {
        pagePassword.style.display = "none";
        passwordChanged.style.display = "flex";
        setTimeout(function () {
          window.location = "/index.html";
        }, 3000);
      }
    });
  }
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
enterEvent(password, passwordValidate);

passwordValidate.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    e.preventDefault();
    buttonReady.click((e) => {
      eventButton(e);
    });
  }
});

buttonReady.addEventListener("click", () => {
  audioButton.play();
  ChangePassword();
});

password.addEventListener("click", () => {
  alertUser.innerHTML = /*html*/ ``;
});

passwordValidate.addEventListener("click", () => {
  alertUser.innerHTML = /*html*/ ``;
});
