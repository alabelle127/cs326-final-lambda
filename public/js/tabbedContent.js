window.currentTab = 0;
const tabs = document.getElementsByClassName("tab");

function hideTab(tab) {
  tabs[tab].classList.remove("d-flex");
  tabs[tab].classList.add("d-none");
}

function showTab(tab) {
  tabs[tab].classList.remove("d-none");
  tabs[tab].classList.add("d-flex");
}

function incTab() {
  hideTab(currentTab);
  currentTab += 1;
  showTab(currentTab)
}

function decTab() {
  hideTab(currentTab);
  currentTab -= 1;
  showTab(currentTab)
}

showTab(currentTab);

for (const nextButton of document.getElementsByClassName("tab-prev")) {
  nextButton.addEventListener("click", decTab);
}
for (const nextButton of document.getElementsByClassName("tab-next")) {
  nextButton.addEventListener("click", incTab);
}
