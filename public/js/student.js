import { getLoggedInUser } from "./getLoggedInUser.js";

const url = window.location.href;
const splitUrl = url.split("/");
const target = splitUrl[splitUrl.length - 1];

let studentData = {};
let studentPrevCourses = {};
let studentCurrCourses = {};
const nameField = document.getElementById("name");
const aboutField = document.getElementById("about");
const contactField = document.getElementById("info");
const previousCoursesField = document.getElementById("previousCourses");
const currentCoursesField = document.getElementById("currentCourses");
const profilePictureField = document.getElementById("profilePic");
const partnersField = document.getElementById("partners");

function getStudentData(student) {
  return {
    name: nameField.value,
    about: aboutField.value,
    contact: contactField.value,
    previousCourses: previousCoursesField.value,
    currentCourses: currentCoursesField.value,
    profilePicture: profilePictureField.src,
  };
}

function setDataFields(data, previousCourses, currentCourses) {
  nameField.innerHTML = `<br /><br />
                            <h3>Name:</h3>
                            <h3>${data.real_name}</h3>`;

  aboutField.innerHTML = `About Me: <br> ${data.description}`;

  contactField.innerHTML = `Contact Information: <br> ${data.contact_info}`;

  previousCoursesField.innerHTML = "";
  for (const c in previousCourses) {
    previousCoursesField.innerHTML += `<li>${previousCourses[c]}</li>`;
  }

  currentCoursesField.innerHTML = "";
  if (data.currentCourses !== undefined) {
    console.log(currentCourses);
    for (const c in currentCourses) {
      currentCoursesField.innerHTML += `<li>${currentCourses[c]}</li>`;
    }
  }

  if (data.profile_picture !== undefined && data.profile_picture !== null) {
    profilePictureField.src = data.profile_picture;
  }
}

getLoggedInUser().then(async (student) => {

  const url = `/api/users/${target}`;
  const r = await fetch(url, {});

  r.json().then(async (info) => {
    studentData = info.data;
    studentPrevCourses = info.data["previousCourses"];

    const classes_url = `/api/users/${target}/registered_classes`;
    const classes_r = await fetch(classes_url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });

    const currClasses = (await classes_r.json()).data ?? [];

    for (const c in currClasses) {
      currClasses[c] = getClassData(currClasses[c]);
    }

    studentCurrCourses = currClasses;
    
    console.log(studentData);
    console.log(currClasses);
    console.log("break");

    setDataFields(studentData, studentPrevCourses, currClasses);
  });
});

function getClassData(class_object) {
  const id = class_object["class"]["subject"]["id"];
  const number = class_object["class"]["number"];
  const name = class_object["class"]["name"];

  return `${id} ${number}: ${name}`;
}