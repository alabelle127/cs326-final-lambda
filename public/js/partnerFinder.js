import { getLoggedInUser } from "./getLoggedInUser.js";
// const compatible_users = [];

function generateUser(userJson, id, classes) {
  const name = userJson["real_name"] ?? "[name not available]";
  const username = userJson["username"] ?? "[username not available]";
  // const classes = userJson["classes"] ?? [];
  const contact = userJson["contact"] ?? "";
  const profile_pic = userJson["profile_picture"] ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/512px-Circle-icons-profile.svg.png";
  const user_notes = userJson["description"] ?? "[description not available]";


  const innerHTML = `
    <div class="list-group">
    <div class="list-group-item list-group-item-action flex-column align-items-start" id="user">
      <div class="d-flex w-100 justify-content-between">
        <!-- Groups and Students can display their picture next to their posting -->
        <img
          src=${profile_pic}
          class="rounded-circle media-left" alt="Group/Student Picture" width="50" height="50">

        <!-- Group/Student Name -->
        <h3 class="mb-1">${name}</h3>
        <h4 class="mb-1">${username}</h4>

        <button id="invite${id}">Send Invite</button>
      </div>

      <!-- Notes about the group. Class, Major, etc -->
      <ul class="mb-1">
        <li>Class(es): ${classes}</li>
        <li>Contact: ${contact}</li>
      </ul>

      <!-- Groups/Students can add a note to their posting -->
      <small>Notes: ${user_notes}</small>
      <div>
        <a href="/students/${id}">View Profile</a>
      </div>
    </div>
  `

  return innerHTML;
}

function getClassData(class_object) {
  const id = class_object["class"]["subject"]["id"];
  const number = class_object["class"]["number"];
  const name = class_object["class"]["name"];

  return `${id} ${number}: ${name}`;
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
  const compatible_users = (await r.json()).data ?? [];

  if(compatible_users.length == 0) {
    alert("There are currently no compatible partners for your schedule");
    return;
  }

  // console.log(`compatible_users: ${JSON.stringify(compatible_users)}`);

  // let i = 0;
  compatible_users.forEach( async (user) => {
    const u_userID = user["_id"].toString();

    if(u_userID === userID) {
      return;
    }

    const classes_url = `/api/users/${u_userID}/registered_classes`;
    const classes_r = await fetch(classes_url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });

    const classes = (await classes_r.json()).data ?? [];
    let string_classes = "";
    classes.forEach( (class_object, index) => {
      string_classes += 
        index === classes.length - 1 ? 
        getClassData(class_object) : 
        getClassData(class_object) + ", ";
    });

    partners.insertAdjacentHTML("afterbegin", 
      generateUser(user, u_userID, string_classes)
      // generateUser(user, i++, string_classes)
    );

    const invite_button = document.getElementById(
      "invite" + u_userID
    );

    invite_button.addEventListener('click', async () => {
      const match_url = `/api/notifications/${userID}/${u_userID}`;
      const match_r = await fetch(match_url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });
    });
  });
});
