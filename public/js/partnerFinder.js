import { getLoggedInUser } from "./getLoggedInUser";

getLoggedInUser().then(async (userID) => {
  if(userID !== null) {
    const url = `/apr/users/${userID}/registered_classes`;
    const r = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    classes = (await r.json()).data;
  }
});
