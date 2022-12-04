import { getLoggedInUser } from "./getLoggedInUser.js";

let profileData = {};
const descriptionField = document.getElementById("form-description");
const contactField = document.getElementById("form-contact");
const profilePictureField = document.getElementById("form-profile_picture");
const privateProfileField = document.getElementById("form-private_profile");
const lookingField = document.getElementById("form-looking_for_partners");

function getDataFromFormValues() {
  return {
    description: descriptionField.value,
    contact: contactField.value,
    profile_picture: profilePictureField.value,
    private_profile: privateProfileField.checked,
    looking_for_partners: lookingField.checked,
  };
}

function setFormValuesFromData(data) {
  descriptionField.value = data.description;
  contactField.value = data.contact_info;
  profilePictureField.value = data.profile_picture;
  privateProfileField.checked = data.private_profile;
  lookingField.checked = data.looking_for_partners;
}

getLoggedInUser().then(async (userID) => {
  if (userID === null) {
    window.location.replace("./login.html");
  }
  const url = `/api/users/${userID}`;
  const r = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  profileData = (await r.json()).data;
  setFormValuesFromData(profileData);

  document.getElementById("save-btn").addEventListener("click", async () => {
    const saveData = getDataFromFormValues();
    const url = `/api/users/${userID}`;
    const r = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(saveData),
    });
    const success = (await r.json()).success;
    if (success) {
      window.location.reload();
    }
  });

  document.getElementById("cancel-btn").addEventListener("click", () => {
    setFormValuesFromData(profileData);
  });
});
