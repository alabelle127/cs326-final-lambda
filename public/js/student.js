const url = window.location.href;
const splitUrl = url.split('/');
const student = splitUrl[splitUrl.length - 2];

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
    nameField.value = data.real_name;
    aboutField.value = data.description;
    contactField.value = data.contact;
    previousCoursesField.value = prevCourses.data;
    currentCoursesField.value = currCourses.data;
    profilePictureField.src = data.profile_picture;
}

(async (student) => {

    console.log("starting student code: " + student)
    const url = `/api/users/ + ${student}`;
    const r = await fetch(url, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    });
    const prevUrl = `/api/users/${student}/previousCourses`;
    const prevCourses = await fetch(prevUrl, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    });
    const currUrl = `/api/users/${student}/registered_classes`
    const currCourses = await fetch(currUrl, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    });

    studentData = (await r.json()).data;
    studentPrevCourses = (await prevCourses.json()).data;
    studentCurrCourses = (await currCourses.json()).data;

    setDataFields(studentData, studentPrevCourses, studentCurrCourses);
})