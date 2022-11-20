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
    for (const c in prevCourses.data) {
        previousCoursesField.innerHTML += `<li>${prevCourses.data[c]}</li>`;
    }

    currentCoursesField.innerHTML = "";
    if (currCourses.data !== undefined) {        
        for (const c in currCourses.data) {
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
    console.log("starting student code: " + student);
    console.log(url);
    console.log("living on a prayer");
    const r = await fetch(url, {});
    
    // console.log("starting prevCourses code: " + student);
    // const prevUrl = `/api/users/${student}/previousCourses`;
    // const prevCourses = await fetch(prevUrl, {
    //     headers: {
    //         Accept: "application/json",
    //         "Content-Type": "application/json"
    //     },
    // });
    
    // console.log("starting currCourses code: " + student);
    // const currUrl = `/api/users/${student}/registered_classes`
    // const currCourses = await fetch(currUrl, {
    //     headers: {
    //         Accept: "application/json",
    //         "Content-Type": "application/json"
    //     },
    // });

    console.log("passed all fetches");

    console.log(r);
    console.log();
    console.log(r.json());
    console.log();
    console.log(r.json().data);

    studentData = (await r.json()).data;
    // studentPrevCourses = (await prevCourses.json()).data;
    // studentCurrCourses = (await currCourses.json()).data;
    studentPrevCourses = (await r.json().data['previousCourses']);
    studentCurrCourses = (await r.json().data['currentCourses']);

    console.log(studentCurrCourses);
    console.log(studentPrevCourses);

    setDataFields(studentData, studentPrevCourses, studentCurrCourses);
});