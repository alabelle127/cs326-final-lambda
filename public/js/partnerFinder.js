import { getLoggedInUser } from "./getLoggedInUser.js";
// const compatible_users = [];

function generateUser(userJson) {
  const name = userJson["name"] ?? "[name]";
  const username = userJson["username"] ?? "[username]";
  const compatible_classes = userJson["compatible_classes"] ?? [];
  const major = userJson["major"] ?? "[major]";
  const minor = userJson["minor"] ?? "[minor]";
  const user_notes = userJson["user_notes"] ?? "[user_notes]";

  const innerHTML = `
    <div class="list-group">
    <div class="list-group-item list-group-item-action flex-column align-items-start" id="user">
      <div class="d-flex w-100 justify-content-between">
        <!-- Groups and Students can display their picture next to their posting -->
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/512px-Circle-icons-profile.svg.png"
          class="rounded-circle media-left" alt="Group/Student Picture" width="50" height="50">

        <!-- Group/Student Name -->
        <h3 class="mb-1">${name}</h3>
        <h4 class="mb-1">${username}</h4>

        <button id="invite">Send Invite</button>
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
  const compatible_users = (await r.json()).data;

  for(let i = 0; i < compatible_users.length; i++) {
    const user = compatible_users[i];
    partners.insertAdjacentHTML("afterbegin", generateUser(user));
  }

  const invite_button = document.getElementById("invite");
  invite_button.addEventListener('click', async () => {
    const userID1 = userID;
    const userID2 = 1234; //Filler id for now
    const match_url = `/api/notifications/${userID1}/${userID2}`;
    const match_r = await fetch(match_url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: userID1,
        to: userID2
      })
    });
    // const match_r = await fetch(match_url, {
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type":"application/json"
    //   }
    // });
  });
});
