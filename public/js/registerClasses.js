import { getLoggedInUser } from "./getLoggedInUser.js";

function renderClassList(
  listElem,
  classItems,
  listItemClass,
  disableElemsOnDeselect,
  emptyListMessage,
  onClassSelected
) {
  listElem.replaceChildren();
  for (const disableElem of disableElemsOnDeselect) {
    disableElem.disabled = true;
  }
  if (classItems.length > 0) {
    let first = true;
    let i = 0;
    for (const classItemData of classItems) {
      const classItemElem = document.createElement("button");
      classItemElem.type = "button";
      classItemElem.classList.add(
        "list-group-item",
        "list-group-item-action",
        listItemClass
      );
      if (first) {
        // Select first item
        classItemElem.classList.add("active");
        first = false;
        for (const disableElem of disableElemsOnDeselect) {
          disableElem.disabled = false;
        }
        onClassSelected(0);
      }
      classItemElem.appendChild(
        document.createTextNode(classItemData.display_text)
      );
      listElem.appendChild(classItemElem);

      ((i) => {
        classItemElem.addEventListener("click", () => {
          // Deselect all other items
          for (const listItemElem of document.getElementsByClassName(
            listItemClass
          )) {
            listItemElem.classList.remove("active");
          }
          // Select this item
          classItemElem.classList.add("active");
          for (const disableElem of disableElemsOnDeselect) {
            disableElem.disabled = false;
          }
          onClassSelected(i);
        });
      })(i);
      ++i;
    }
  } else {
    const classItemElem = document.createElement("button");
    classItemElem.type = "button";
    classItemElem.disabled = true;
    classItemElem.classList.add("list-group-item", "list-group-item-action");
    classItemElem.appendChild(document.createTextNode(emptyListMessage));
    listElem.appendChild(classItemElem);
  }
}

/**
 * Search for classes to add
 */
const addClassButton = document.getElementById("add-class-btn");
const searchBarElem = document.getElementById("class-search-bar");
const searchButtonElem = document.getElementById("class-search-btn");
const resultsListElem = document.getElementById("class-search-list");

let selectedSearchClass = undefined;
addClassButton.disabled = true;

async function searchClasses() {
  // Update search list with search results
  const query = searchBarElem.value;
  const url = `/api/classes/search?${new URLSearchParams({ q: query })}`;
  const r = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const responseData = await r.json();

  // Set search results
  selectedSearchClass = undefined;
  renderClassList(
    resultsListElem,
    responseData,
    "search-item",
    [addClassButton],
    "No classes found",
    (i) => {
      selectedSearchClass = responseData[i];
    }
  );
}

/**
 * Manage current classes
 */

window.classes = [];
const removeClassButton = document.getElementById("remove-class-btn");
const classListElem = document.getElementById("class-list");
const saveButtonElem = document.getElementById("save-btn");
let selectedClassIndex = undefined;
removeClassButton.disabled = true;

function addSelectedClass() {
  // Add class selected from class search to current class list
  // TODO: Don't add class if duplicate
  classes.push(selectedSearchClass);
  renderClassList(
    classListElem,
    classes,
    "class-item",
    [removeClassButton],
    "No classes registered",
    (i) => {
      selectedClassIndex = i;
    }
  );
}

function removeSelectedClass() {
  classes.splice(selectedClassIndex, 1);
  renderClassList(
    classListElem,
    classes,
    "class-item",
    [removeClassButton],
    "No classes registered",
    (i) => {
      selectedClassIndex = i;
    }
  );
}

getLoggedInUser().then(async (userID) => {
  if (userID != null) {
    const url = `/api/users/${userID}/registered_classes`;
    const r = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    classes = (await r.json()).data;
  }

  renderClassList(
    classListElem,
    classes,
    "class-item",
    [removeClassButton],
    "No classes registered",
    (i) => {
      selectedClassIndex = i;
    }
  );

  searchButtonElem.addEventListener("click", searchClasses);
  addClassButton.addEventListener("click", addSelectedClass);
  removeClassButton.addEventListener("click", removeSelectedClass);

  if (saveButtonElem) {
    saveButtonElem.addEventListener("click", async () => {
      const url = `/api/users/${userID}/registered_classes`;
      const r = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classes: classes,
        }),
      });
      await r.json();
    });
  }
});
