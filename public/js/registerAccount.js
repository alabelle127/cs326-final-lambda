const firstPageButtonElem = document.getElementById("page-1-button");
const registerButtonElem = document.getElementById("register-btn");
const errorAlertElem = document.getElementById("error-alert");
const googleAuthButtonElem = document.getElementById("google-auth-btn");

function setValidationError(error) {
  errorAlertElem.replaceChildren(document.createTextNode(error));
  errorAlertElem.classList.remove("d-none");
  errorAlertElem.classList.add("d-flex");
}

firstPageButtonElem.addEventListener("click", async (event) => {
  // validate inputs
  const formData = new FormData(document.getElementById("register-form"));
  if (formData.get("password") !== formData.get("password2")) {
    setValidationError("Passwords do not match");
    return;
  }
  if (formData.get("password").length < 6) {
    setValidationError("Password must be at least 6 characters long");
    return;
  }
  if (
    Math.min(
      formData.get("realName").length,
      formData.get("username").length,
      formData.get("contact").length,
      formData.get("description").length
    ) === 0
  ) {
    setValidationError("One or more fields are not filled out");
    return;
  }
  const url = `/api/exists/${formData.get("username")}`;
  const r = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const { exists } = await r.json();
  if (exists) {
    setValidationError("Username already exists");
    return;
  }
  incTab();
});

registerButtonElem.addEventListener("click", async () => {
  const formData = new FormData(document.getElementById("register-form"));
  const url = `/api/register`;
  const r = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: formData.get("username"),
      password: formData.get("password"),
      real_name: formData.get("realName"),
      contact: formData.get("contact"),
      description: formData.get("description"),
      classes: window.classes.map((classData) => classData._id),
    }),
  });
  const { success } = await r.json();
  if (success) {
    window.location.replace("/");
  } else {
    console.error("Error while registering");
  }
});

(async () => {
  const url = `/api/google_auth_url`;
  const r = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    }
  });
  const google_url = (await r.json()).url;
  googleAuthButtonElem.href = google_url;
  googleAuthButtonElem.classList.remove("disabled");
})();