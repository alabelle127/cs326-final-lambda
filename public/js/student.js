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

function setDataFields(data) {
  nameField.innerHTML = `<br /><br />
                            <h3>Name:</h3>
                            <h3>${data.real_name}</h3>`;

  aboutField.innerHTML = `About Me: <br> ${data.description}`;

  contactField.innerHTML = `Contact Information: <br> ${data.contact_info}`;

  previousCoursesField.innerHTML = "";
  for (const c in data.previousCourses) {
    previousCoursesField.innerHTML += `<li>${data.previousCourses[c]}</li>`;
  }

  currentCoursesField.innerHTML = "";
  if (data.currentCourses !== undefined) {
    for (const c in data.currentCourses) {
      currentCoursesField.innerHTML += `<li>${data.currentCourses[c]}</li>`;
    }
  }

  if (data.profile_picture !== undefined && data.profile_picture !== null) {
    profilePictureField.src = data.profile_picture;
  }
}

getLoggedInUser().then(async (student) => {
  // this is being commented out for testing purposes
  // if (student === null) {
  //     window.location.replace("./login.html");
  // }

  const url = `/api/users/${target}`;
  const r = await fetch(url, {});

  r.json().then(async (info) => {
    studentData = info.data;
    // studentPrevCourses = info.data["previousCourses"];
    studentCurrCourses = info.data["currentCourses"];

    const classes_url = `/api/users/${target}/registered_classes`;
    const classes_r = await fetch(classes_url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });

    const classes = (await classes_r.json()).data ?? [];

    for (const c in classes) {
      classes[c] = getClassData(classes[c]);
    }

    studentPrevCourses = classes;

    console.log(studentData);
    console.log("break");
    console.log(studentCurrCourses);
    console.log(studentPrevCourses);

    setDataFields(studentData, studentPrevCourses, studentCurrCourses);
  });
});

function getClassData(class_object) {
  const id = class_object["class"]["subject"]["id"];
  const number = class_object["class"]["number"];
  const name = class_object["class"]["name"];

  return `${id} ${number}: ${name}`;
}