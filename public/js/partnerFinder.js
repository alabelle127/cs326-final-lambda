import { getLoggedInUser } from "./getLoggedInUser";
const compatible_users = [];

function generateUser(userJson) {
  const name = userJson["name"];
  const username = userJson["username"];
  const compatible_classes = userJson["compatible_users"];
  const major = userJson["major"];
  const minor = userJson["minor"];
  const user_notes = userJson["user_notes"];

  const innerHTML = `
    <div class="list-group">
    <div class="list-group-item list-group-item-action flex-column align-items-start">
      <div class="d-flex w-100 justify-content-between">
        <!-- Groups and Students can display their picture next to their posting -->
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/512px-Circle-icons-profile.svg.png"
          class="rounded-circle media-left" alt="Group/Student Picture" width="50" height="50">

        <!-- Group/Student Name -->
        <h3 class="mb-1">${name}</h3>
        <h4 class="mb-1">${username}</h4>

        <button>Send Invite</button>
      </div>

      <!-- Notes about the group. Class, Major, etc -->
      <ul class="mb-1">
        <li>Class(es): ${compatible_classes}</li>
        <li>Majors: ${major}</li>
        <li>Minor: ${minor}</li>
      </ul>

      <!-- Groups/Students can add a note to their posting -->
      <small>Notes: ${user_notes}</small>
    </div>
  `

  return innerHTML;
}


getLoggedInUser().then(async (userID) => {
  if(userID === null) {
    window.location.replace("./login.html");
  }
  const url = `/api/users/${userID}/compatible_partners`;
  const r = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });

  const partners = document.getElementById("partners");
  compatible_users = (await r.json()).data;

  for(const user in compatible_users) {
    partners.insertAdjacentHTML(generateUser(user));
  }
});
