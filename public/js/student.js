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

function setDataFields(data, prevCourses, currCourses) {
    nameField.innerHTML = `<br /><br />
                            <h3>Name:</h3>
                            <h3>${data.real_name}</h3>`;
    
    aboutField.innerHTML = `About Me: <br> ${data.description}`;

    contactField.innerHTML = `Contact Information: <br> ${data.contact_info}`;

    previousCoursesField.innerHTML = "";
    console.log(prevCourses.data);
    for (const c in prevCourses.data) {
        console.log(c);
        console.log(prevCourses.data[c]);
        previousCoursesField.innerHTML += `<li>${prevCourses.data[c]}</li>`;
    }

    currentCoursesField.innerHTML = "";
    console.log(currCourses.data);
    if (currCourses.data !== undefined) {        
        for (const c in currCourses.data) {
            console.log(c);
            console.log(currCourses.data[c]);
            currentCoursesField.innerHTML += `<li>${prevCourses.data[c]}</li>`;
        }
    }

    profilePictureField.src = data.profile_picture;
}

getLoggedInUser().then(async (student) => {
    // this is being commented out for testing purposes
    // if (student === null) {
    //     window.location.replace("./login.html");
    // }

    const url = `/api/student/${target}`;
    // console.log("starting student code: " + student);
    // console.log(url);
    // console.log("living on a prayer");
    const r = await fetch(url, {});

    // console.log("passed all fetches");

    console.log(r);
    r.json().then(info => {
        // console.log(info.result);
        // console.log(info.data);

        studentData = info.data;
        studentPrevCourses = info.data['previousCourses'];
        studentCurrCourses = info.data['currentCourses'];

        // console.log(studentData);
        console.log(studentCurrCourses);
        console.log(studentPrevCourses);
    
        setDataFields(studentData, studentPrevCourses, studentCurrCourses);
    });
});