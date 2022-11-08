const formElem = document.getElementById("login-form");
const loginButtonElem = document.getElementById("login-btn");
const errorAlertElem = document.getElementById("error-alert");

async function login() {
  const formData = new FormData(formElem);
  const url = `/api/login`;
  const r = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: formData.get("username"),
      password: formData.get("password"),
    }),
  });
  const { success, userID } = await r.json();
  if (success) {
    window.location.replace("/");
  } else {
    errorAlertElem.replaceChildren(document.createTextNode("Invalid login"));
    errorAlertElem.classList.remove("d-none");
    errorAlertElem.classList.add("d-flex");
  }
}

loginButtonElem.addEventListener("click", login);
