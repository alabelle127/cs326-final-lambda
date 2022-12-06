import { getLoggedInUser } from "./getLoggedInUser.js";

getLoggedInUser().then((userID) => {
  if (userID !== null) {
    // disable create account button
    document.getElementById("register-btn").classList.add("disabled");
  }
});
