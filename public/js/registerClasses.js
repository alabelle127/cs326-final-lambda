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
  //const url = `${API_URL}/classes/search`;
  //fetch(url);
  const responseData = [
    {
      display_text: "CS 326 (Not current)",
      current: false,
      department: "CS",
      class_number: 326,
      class_perma_id: "NC-CS326",
    },
    {
      display_text: "CS 326 (Berger) TuTh 1:00-2:15 [44866]",
      current: true,
      department: "CS",
      class_number: 326,
      class_id: 44866,
      class_perma_id: "2022F-44866",
      professor: "Emery Berger",
      meeting_times: [
        {
          day: "Tu",
          start_time: 1300,
          end_time: 1415,
        },
        {
          day: "Th",
          start_time: 1300,
          end_time: 1415,
        },
      ],
    },
    {
      display_text: "CS 326 (Klemperer) TuTh 1:00-2:15 [57113]",
      current: true,
      department: "CS",
      class_number: 326,
      class_id: 57113,
      class_perma_id: "2022F-57113",
      professor: "Peter Klemperer",
      meeting_times: [
        {
          day: "Tu",
          start_time: 1300,
          end_time: 1415,
        },
        {
          day: "Th",
          start_time: 1300,
          end_time: 1415,
        },
      ],
    },
  ];

  // Set search results
  selectedSearchClass = undefined;
  renderClassList(
    resultsListElem,
    responseData,
    "search-item",
    [addClassButton],
    "No classes found",
    (i) => {
      console.log(`Setting searchClass to index ${i}`);
      selectedSearchClass = responseData[i];
    }
  );
}

/**
 * Manage current classes
 */
const classes = [];
const removeClassButton = document.getElementById("remove-class-btn");
const classListElem = document.getElementById("class-list");
let selectedClassIndex = undefined;
removeClassButton.disabled = true;

function addSelectedClass() {
  // Add class selected from class search to current class list
  // TODO: Don't add if duplicate
  classes.push(selectedSearchClass);
  console.log(selectedSearchClass);
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
