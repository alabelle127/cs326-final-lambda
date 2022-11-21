import { getLoggedInUser } from "./getLoggedInUser.js";

const url = window.location.href;
const splitUrl = url.split('?');
const target = splitUrl[splitUrl.length - 1];

let studentData = {};
let studentPrevCourses = {};
let studentCurrCourses = {};
const nameField = document.getElementById('name');
const aboutField = document.getElementById('about');
const contactField = document.getElementById('info');
const previousCoursesField = document.getElementById('previousCourses');
const currentCoursesField = document.getElementById('currentCourses');
const profilePictureField = document.getElementById('profilePic');


function getStudentData(student) {
    return {
        name: nameField.value,
        about: aboutField.value,
        contact: contactField.value,
        previousCourses: previousCoursesField.value,
        currentCourses: currentCoursesField.value,
        profilePicture: profilePictureField.src
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

    const url = `/api/student/${target}`;
    const r = await fetch(url, {});

    r.json().then(async info => {
        studentData = info.data;
        studentPrevCourses = info.data['previousCourses'];
        studentCurrCourses = info.data['currentCourses'];
    
        setDataFields(studentData, studentPrevCourses, studentCurrCourses);
    });
});