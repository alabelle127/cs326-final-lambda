import { getLoggedInUser } from "./getLoggedInUser.js";

let navbarItems = {
  Home: "./",
  "Find groups": "./StudentGroupFinder.html",
  "Add/remove classes": "./register_classes.html",
};

function generateNavbar(navbarElem, currentPage, loggedInUserID) {
  navbarElem.innerHTML = `
  <div class="container-fluid">
    <a class="navbar-brand" href="./">
        <!--Placeholder logo-->
        <img src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/3c662b51418913.58ecfcd8b6b18.png"
            alt="logo" width="30" height="30" class="d-inline-block align-text-top">
        Study Buddies
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
        aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent"></div>
  </div>`;
  const navContentElem = document.getElementById("navbarSupportedContent");
  const contentList = document.createElement("ul");
  navContentElem.appendChild(contentList);
  contentList.classList.add("navbar-nav", "me-auto", "mb-2", "mb-lg-0");
  for (const title of Object.keys(navbarItems)) {
    const href = title === currentPage ? "#" : navbarItems[title];
    const navItemElem = document.createElement("li");
    navItemElem.classList.add("nav-item");
    const navItemLinkElem = document.createElement("a");
    navItemLinkElem.classList.add("nav-link");
    if (title === currentPage) {
      navItemLinkElem.classList.add("active");
    }
    navItemLinkElem.href = href;
    navItemLinkElem.appendChild(document.createTextNode(title));
    navItemElem.appendChild(navItemLinkElem);
    contentList.appendChild(navItemElem);
  }
  if (loggedInUserID != null) {
    // TODO: get profile picture from loggedInUserID
    navContentElem.insertAdjacentHTML(
      "beforeend",
      `<div class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <!--Placeholder profile picture-->
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/512px-Circle-icons-profile.svg.png"
                class="rounded-circle" alt="Profile picture" width="50" height="50">
        </a>
        <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="./students/${loggedInUserID}">View profile</a></li>
            <li><a class="dropdown-item" href="./account_settings.html">Settings</a></li>
            <li>
                <hr class="dropdown-divider">
            </li>
            <li><a id="logout-btn" class="dropdown-item text-danger" href="#">Sign out</a></li>
        </ul>
      </div>`
    );
    const logoutButtonElem = document.getElementById("logout-btn");
    logoutButtonElem.addEventListener("click", async () => {
      const url = "/api/logout";
      const r = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      window.sessionStorage.removeItem("userID");
      window.location.reload();
    });
  } else {
    navContentElem.insertAdjacentHTML(
      "beforeend",
      `<div>
            <a class="btn btn-outline-primary" href="./register.html">Create account</a>
            <a class="btn btn-primary" href="./login.html">Login</a>
       </div>`
    );
  }
}

getLoggedInUser().then((userID) => {
  if (userID === null) {
    navbarItems = {
      Home: "./",
    };
  }
  const currentPage = document.querySelector('meta[name="nav-name"]').content;

  for (const navbarElem of document.getElementsByClassName("navbar")) {
    generateNavbar(navbarElem, currentPage, userID);
  }
});
