const puppeteer = require("puppeteer");

//COMMENT OR UNCOMMENT OUT THE ZOOM ACCOUNT FOR USE
const email = require("./personal/password").zoomEmail1;
const password = require("./personal/password").zoomPassword1;
// const email = require("./personal/password").zoomEmail2;
// const password = require("./personal/password").zoomPassword2;
// const email = require("./personal/password").zoomEmail3;
// const password = require("./personal/password").zoomPassword3;
// const email = require("./personal/password").zoomEmail4;
// const password = require("./personal/password").zoomPassword4;

// const candidateName = "Eve Test";

(async (email, password) => {
  const candidateName = "Eve Test"; //cannot leave it outside && need to look into when refactor
  const time = "1:00";
  const ampm = "PM";

  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  //navigate to page
  await page.goto("https://www.zoom.us/signin");
  await page.waitFor("#email");
  await page.waitFor("#password");

  //log-in
  //adding to the window
  await page.evaluate(
    (email, password) => {
      window.email = email;
      window.password = password;
    },
    email,
    password
  );

  await page.$eval("#email", el => (el.value = window.email));
  await page.$eval("#password", el => (el.value = window.password));

  // remnove credential from window
  await page.evaluate(() => {
    window.email = null;
    window.password = null;
  });

  await page.click(".submit");

  //navigate to schedule meeting form
  await page.waitFor("#btnScheduleMeeting");
  await page.click("#btnScheduleMeeting");

  //enter meeting title & description
  await page.waitFor("#topic");
  await page.evaluate(candidateName => {
    let topic = document.getElementById("topic");
    topic.value = `App Academy Interview with ` + candidateName;
  }, candidateName);

  await page.evaluate(() => {
    let agenda = document.getElementById("agenda");
    agenda.value = "App Academy Non-technical Interview";
  });

  //enter start time
  await page.waitFor("#start_time");
  await page.evaluate(time => {
    const inviteTime = document.getElementById("start_time");
    inviteTime.value = time;
  }, time);

  await page.evaluate(ampm => {
    const morningAfternoon = document.getElementById("start_time");
    morningAfternoon.value = ampm;
  }, ampm);

  await page.waitFor("#duration_hr");
  await page.evaluate(() => {
    const hr = document.getElementById("duration_hr");
    hr.value = "0";
  });
  await page.waitFor("#duration_min");
  await page.evaluate(() => {
    const durationMin = document.getElementById("duration_min");
    durationMin.value = "30";
  });

  // await page.waitFor("#option_video_host_on");
  // await page.evaluate(() => {
  //   const hostVideoOption = document.getElementById("option_video_host_on");
  //   hostVideoOption.checked = "checked";
  // });

  // await page.waitFor("#option_audio_both");
  // await page.evaluate(() => {
  //   const audioOption = document.getElementById("option_audio_both");
  //   audioOption.checked = "checked";
  // });

  // await page.evaluate(() => {
  //   const waitingRoomOption = document.getElementById("option_waiting_room");
  //   waitingRoomOption.checked = "checked";
  // });
  // await page.evaluate(() => {
  //   const recordOption = document.getElementById("option_autorec_cloud");
  //   recordOption.checked = "checked";
  // });

  // await page.click(".submit");

  await page.waitForNavigation();
})(email, password);
