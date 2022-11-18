const registerButtonElem = document.getElementById("register-btn");
// TODO: form validation, google authentication
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
      classes: window.classes,
    }),
  });
  const { success } = await r.json();
  if (success) {
    window.location.replace("/");
  }
});
