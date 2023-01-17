const email = document.getElementById("email");
const emailConfirmation = document.getElementById("emailConfirmation");
const buttonReady = document.getElementById("buttonReady");
const alertUser = document.getElementById("alertUser");
const audioButton = document.getElementById("audioButton");
const pagePasswordMail = document.getElementById("pagePasswordMail");
const mailSend = document.getElementById("mailSend");
const arrowReturn = document.getElementById("return");
const textMailSend = document.getElementById("textMailSend");

arrowReturn.addEventListener("click", () => (window.location = "/index.html"));
function sendMailPassword() {
  const Email = email.value.trim();
  const EmailConfirmation = emailConfirmation.value.trim();
  textMailSend.innerHTML = /* html */ `
  <p>Le mail a été envoyé à l'adresse ${Email} </p>
`;
  if (Email != EmailConfirmation) {
    alertUser.innerHTML =
      /*html*/
      `<p>Les emails sont différents</p>`;
  } else {
    const data = JSON.stringify({ email: Email });
    fetch(config.apiUrl + "/api/names/:id/mail", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: data,
    }).then(async (response) => {
      await response.json();
      if (response.status === 400) {
        alertUser.innerHTML =
          /*html*/
          `<p>il faut remplir correctement les champs ;)</p>`;
      } else {
        pagePasswordMail.style.display = "none";
        mailSend.style.display = "block";
      }
    });
  }
}

email.addEventListener("click", () => {
  alertUser.innerHTML =
    /*html*/
    ``;
});

emailConfirmation.addEventListener("click", () => {
  alertUser.innerHTML =
    /*html*/
    ``;
});

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
enterEvent(email, emailConfirmation);

emailConfirmation.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    e.preventDefault();
    buttonReady.click((e) => {
      eventButton(e);
    });
  }
});

buttonReady.addEventListener("click", () => {
  audioButton.play();
  sendMailPassword();
});
