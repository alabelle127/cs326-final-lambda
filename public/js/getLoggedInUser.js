export async function getLoggedInUser() {
  if (window.sessionStorage.getItem("userID")) {
    return window.sessionStorage.getItem("userID");
  }
  const url = "/api/me";
  const r = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const { loggedIn, userID } = await r.json();
  if (userID != null) {
    window.sessionStorage.setItem("userID", userID);
  }
  return userID;
}
