// Scrape data from spire into database
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
import { Browser, Builder, By, until } from "selenium-webdriver";
import { ElementClickInterceptedError } from "selenium-webdriver/lib/error.js";

dotenv.config();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const TERM = "2022 Fall"; // "2023 Spring", "2022 Winter", "2022 Fall" ...

// class search element IDs
const SID = {
  term: "UM_DERIVED_SA_UM_TERM_DESCR",
  search: "win0divCLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH", // search button
  newSearch: "CLASS_SRCH_WRK2_SSR_PB_NEW_SEARCH", // go back to search button
  subject: "CLASS_SRCH_WRK2_SUBJECT$108$", // "Accounting", "Aerospace Studies" ...
  courseNumberOperator: "CLASS_SRCH_WRK2_SSR_EXACT_MATCH1", // set to "greater than or equal to"
  courseNumber: "CLASS_SRCH_WRK2_CATALOG_NBR$8$", // set to 0
  showOpenOnly: "CLASS_SRCH_WRK2_SSR_OPEN_ONLY", // set to unchecked
  error: "DERIVED_CLSMSG_ERROR_TEXT", // no search results error
};

// class result element IDs
const RID = {
  results: "ACE_$ICField102$0",
  numClasses: "$ICField106$hpage$",
  desc: "DERIVED_CLSRCH_DESCR200$",
  session: "PSXLATITEM_XLATSHORTNAME$",
  classname: "DERIVED_CLSRCH_SSR_CLASSNAME_LONG$",
  times: "MTG_DAYTIME$",
  room: "MTG_ROOM$",
  instructors: "win0divUM_DERIVED_SR_UM_HTML1$",
};

async function saveClassToDB(classData) {
  // console.log(JSON.stringify(classData));
  await client.db("classes").collection(TERM).insertOne(classData);
}

async function waitForSearchPageToLoad(driver) {
  await driver.wait(
    until.elementLocated(By.id("UM_DERIVED_SA_UM_TERM_DESCR"), 1000)
  );
}

async function clickUntilWorks(driver, elementID) {
  while (true) {
    try {
      const elem = await driver.findElement(By.id(elementID));
      await elem.click();
      return elem;
    } catch (err) {
      if (err instanceof ElementClickInterceptedError) {
        await new Promise((r) => setTimeout(r, 1000));
      } else {
        throw err;
      }
    }
  }
}

async function isSearchError(driver) {
  const errors = await driver.findElements(By.id(SID.error));
  if (errors.length === 0) {
    return false;
  }
  if (await errors[0].isDisplayed()) {
    console.log(`search error: ${await errors[0].getText()}`);
    return true;
  } else {
    return false;
  }
}

const daysTimesRegex =
  /^\s*(Mo)?(Tu)?(We)?(Th)?(Fr)?(Sa)?(Su)?\s*(\d{1,2}):(\d{2})(AM|PM)\s*-\s*(\d{1,2}):(\d\d)(AM|PM)\s*$/;
function parseDaysTimesString(str) {
  if (str.includes("TBA")) {
    return null;
  }
  const match = daysTimesRegex.exec(str);
  const days = {
    mon: match[1] != undefined,
    tue: match[2] != undefined,
    wed: match[3] != undefined,
    thu: match[4] != undefined,
    fri: match[5] != undefined,
    sat: match[6] != undefined,
    sun: match[7] != undefined,
  };
  const startTime =
    (match[10] === "PM" && parseInt(match[8]) != 12
      ? parseInt(match[8]) + 12
      : parseInt(match[8])) *
      100 +
    parseInt(match[9]);
  const endTime =
    (match[13] === "PM" && parseInt(match[11]) != 12
      ? parseInt(match[11]) + 12
      : parseInt(match[11])) *
      100 +
    parseInt(match[12]);
  return {
    days: days,
    startTime: startTime,
    endTime: endTime,
  };
}

function parseRoomString(str) {
  if (str.includes("TBA")) {
    return null;
  }
  return str;
}

const classDescRegex = /^(\S+)\s+(\S+)\s+(.+)$/;
function parseClassDescString(str) {
  const match = classDescRegex.exec(str);
  return {
    subject: match[1],
    number: match[2],
    name: match[3],
  };
}

const classIDRegex = /([0-9A-Z]+)-([A-Z]+)\((\d+)\)/;
function parseClassIDString(str) {
  const match = classIDRegex.exec(str);
  return {
    number: match[1],
    type: match[2],
    id: parseInt(match[3]),
  };
}

async function loadClassSearch(driver) {
  // navigate to course search
  await driver.get(
    "https://www.spire.umass.edu/psp/heproda/?cmd=login&languageCd=ENG#"
  );
  await driver.findElement(By.name("CourseCatalogLink")).click();
  const iframeElem = await driver.wait(
    until.elementLocated(By.id("ptifrmtgtframe"))
  );
  driver.switchTo().frame(iframeElem);
  await waitForSearchPageToLoad(driver);

  // initial search setup

  // select term
  const termDropdown = await clickUntilWorks(driver, SID.term);
  await termDropdown
    .findElement(By.xpath(`option[text() = '${TERM}']`))
    .click();

  // select course number greater than or equal to
  const operatorDropdown = await clickUntilWorks(
    driver,
    SID.courseNumberOperator
  );
  await operatorDropdown.findElement(By.css('option[value="G"]')).click();
  // input course number 0
  await driver.findElement(By.id(SID.courseNumber)).sendKeys("0");
  // uncheck show open classes only
  await clickUntilWorks(driver, SID.showOpenOnly);
}

// assume we are at search page already and return to search page after scraping
async function scrapeSubject(driver, subjectValue) {
  const subjectDropdown = await clickUntilWorks(driver, SID.subject);
  // Select subject
  const subjectOption = await subjectDropdown.findElement(
    By.css(`option[value="${subjectValue}"]`)
  );
  const subjectName = await subjectOption.getText();
  console.log("scraping subject: " + subjectName);
  await subjectOption.click();
  // search
  await clickUntilWorks(driver, SID.search);
  // wait for results page, OR error
  await driver.wait(
    until.elementLocated(
      By.xpath(`//*[@id='${SID.error}' or @id='${SID.newSearch}']`),
      1000
    )
  );
  if (await isSearchError(driver)) {
    await loadClassSearch(driver);
    return;
  }
  const results = await driver.findElement(By.id(RID.results));
  const numResults = Math.floor(
    (await results.findElements(By.xpath("tbody/tr"))).length / 4
  );
  let numSections = 0;
  for (let i = 0; i < numResults; ++i) {
    // ACCOUNTG  196ISH Honors Independent Study In Accounting
    const descStr = await results.findElement(By.id(RID.desc + i)).getText();
    const classDesc = parseClassDescString(descStr);

    const numClassSections = (
      await results
        .findElement(By.id(RID.numClasses + i))
        .findElements(By.css("option"))
    ).length;

    for (let j = 0; j < numClassSections; ++j) {
      // University
      const session = await results
        .findElement(By.id(RID.session + numSections))
        .getText();
      // 01-IND(58032)
      const classIDStr = await results
        .findElement(By.id(RID.classname + numSections))
        .getText();
      const sectionName = parseClassIDString(classIDStr);

      // TuTh 2:30PM - 3:45PM or TBA
      const timesStr = await results
        .findElement(By.id(RID.times + numSections))
        .getText();
      const times = parseDaysTimesString(timesStr);

      // Mahar room 108 or TBA or On-Line
      const roomStr = await results
        .findElement(By.id(RID.room + numSections))
        .getText();
      const room = parseRoomString(roomStr);

      let instructors = [];
      const instructorsElem = await results
        .findElement(By.id(RID.instructors + numSections))
        .findElement(By.css("div"));
      try {
        const fontElem = await instructorsElem.findElement(By.css("font"));
        // can have one or more links, or 'Staff' text
        const staffLinks = await fontElem.findElements(By.css("a"));
        if (staffLinks.length === 0) {
          instructors.push({
            name: await fontElem.getText(),
            email: undefined,
          });
        } else {
          for (const link of staffLinks) {
            instructors.push({
              name: await link.getText(),
              // remove 'mailto:'
              email: (await link.getAttribute("href")).slice(7),
            });
          }
        }
      } catch (err) {
        // no instructors listed
      }
      numSections++;

      const classSection = {
        class: {
          subject: {
            id: classDesc.subject,
            name: subjectName,
          },
          number: classDesc.number,
          name: classDesc.name,
        },
        name: sectionName,
        instructors: instructors,
        meeting_times: times,
        room: room,
      };
      saveClassToDB(classSection);
    }
  }
  await driver.findElement(By.id(SID.newSearch)).click();
  await waitForSearchPageToLoad(driver);
}

// begin scraping
(async () => {
  let driver = await new Builder().forBrowser(Browser.FIREFOX).build();
  try {
    await client.connect();
    await loadClassSearch(driver);
    const subjectDropdown = await driver.findElement(By.id(SID.subject));
    const subjectValues = [];
    for (const optionElem of await subjectDropdown.findElements(
      By.css("option")
    )) {
      subjectValues.push(await optionElem.getAttribute("value"));
    }
    subjectValues.splice(0, 1); // remove empty entry at start
    for (const subjectValue of subjectValues) {
      await scrapeSubject(driver, subjectValue);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await driver.quit();
    await client.close();
  }
})();
