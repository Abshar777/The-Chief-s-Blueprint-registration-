/**
 * The Chief's Blueprint — Registration
 * Google Apps Script (Web App)
 *
 * Same Google Sheet as the other Delta registration forms.
 * Writes to a dedicated tab: "Chiefs Blueprint Registrations"
 * (created automatically on first submission if it doesn't exist).
 *
 * Sheet columns:
 *   A  Timestamp
 *   B  Full Name                 C  Email                    D  Phone
 *   E  Occupation                F  Current Course at Delta  G  Ready for 6-Month Journey
 *   H  Trading Experience        I  Expectations             J  Preferred Session
 *   K  Will Attend Consistently  L  Kept Trading Journal     M  Ready to Build as Disciplined Trader
 *   N  Seriousness               O  One Thing to Change      P  Takes Responsibility for Execution
 *   Q  Six Months From Now
 *
 * Deploy as Web App (in the same bound script project):
 *   Execute as: Me
 *   Who has access: Anyone
 */

const SHEET_NAME = "Chiefs Blueprint Registrations";
const HEADERS    = [
  "Timestamp",
  "Full Name",
  "Email",
  "Phone",
  "Occupation",
  "Current Course at Delta",
  "Ready for 6-Month Journey",
  "Trading Experience",
  "Expectations",
  "Preferred Session",
  "Will Attend Consistently",
  "Kept Trading Journal",
  "Ready to Build as Disciplined Trader",
  "Seriousness",
  "One Thing to Change",
  "Takes Responsibility for Execution",
  "Six Months From Now",
];

function getOrCreateSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);

    // Write & style header row
    sheet.appendRow(HEADERS);
    const header = sheet.getRange(1, 1, 1, HEADERS.length);
    header.setBackground("#b80c0c");
    header.setFontColor("#ffffff");
    header.setFontWeight("bold");
    header.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);

    // Auto-resize columns for readability
    sheet.autoResizeColumns(1, HEADERS.length);
  }

  return sheet;
}

function doPost(e) {
  try {
    const data  = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    sheet.appendRow([
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.fullName               || "",
      data.email                  || "",
      data.phone                  || "",
      data.occupation             || "",
      data.currentCourse          || "",
      data.readyForJourney        || "",
      data.tradingDuration        || "",
      data.expectations           || "",
      data.sessionPreference      || "",
      data.willAttendConsistently || "",
      data.keptJournal            || "",
      data.readyToBuild           || "",
      data.seriousness            || "",
      data.oneThingToChange       || "",
      data.takeResponsibility     || "",
      data.sixMonthsFromNow       || "",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", form: "The Chief's Blueprint Registration" }))
    .setMimeType(ContentService.MimeType.JSON);
}
