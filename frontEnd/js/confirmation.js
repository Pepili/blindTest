const url = new URLSearchParams(document.location.search);
const id = url.get("id");
const data = JSON.stringify({ userId: id });
const pageConfirm = document.getElementById("pageConfirmation");
function activeMail() {
  if (id === null) {
    alert("Désolé, vous n'avez pas accès à cette page");
    window.location = "/index.html";
  } else {
    pageConfirm.style.display = "block";
    fetch(config.apiUrl + "/api/names/confirm/:id", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: data,
    })
      .then(async (response) => {
        await response.json();
      })
      .catch(() => console.log("error"));
  }
}

activeMail();
