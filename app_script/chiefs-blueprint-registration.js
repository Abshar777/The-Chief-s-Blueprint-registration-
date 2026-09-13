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
 * Reliability:
 *   - Each submission carries a `submissionId`. The result is cached for 6 h so the form
 *     can ask `GET ?check=<submissionId>` if Google loses the POST response page
 *     (the script.googleusercontent.com relay sometimes returns a 404 after the redirect).
 *   - A re-sent submissionId is NOT written twice (no duplicate rows on retry).
 *   - Phone numbers are stored as text so "+91 ..." is not parsed as a formula (#ERROR!).
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

const CACHE_TTL_SECONDS = 21600; // 6 hours (max allowed)

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Force a value to be stored as plain text (leading apostrophe = text marker in Sheets). */
function asText(v) {
  const s = v == null ? "" : String(v).trim();
  return s ? "'" + s : "";
}

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
  const cache = CacheService.getScriptCache();
  let submissionId = "";

  try {
    const data = JSON.parse(e.postData.contents);
    submissionId = String(data.submissionId || "").trim();

    // Retry of an already-written submission → acknowledge, don't write a duplicate row
    if (submissionId && cache.get("sub:" + submissionId) === "success") {
      return json({ status: "success", duplicate: true });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      const sheet = getOrCreateSheet();
      sheet.appendRow([
        new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        data.fullName               || "",
        data.email                  || "",
        asText(data.phone),
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
    } finally {
      lock.releaseLock();
    }

    if (submissionId) cache.put("sub:" + submissionId, "success", CACHE_TTL_SECONDS);
    return json({ status: "success" });

  } catch (err) {
    if (submissionId) cache.put("sub:" + submissionId, "error:" + err.message, CACHE_TTL_SECONDS);
    return json({ status: "error", message: err.message });
  }
}

function doGet(e) {
  const check = e && e.parameter && e.parameter.check;

  // Form asks: "did submission <id> go through?" (used when the POST response page was lost)
  if (check) {
    const v = CacheService.getScriptCache().get("sub:" + String(check).trim());
    if (!v)              return json({ status: "unknown" });
    if (v === "success") return json({ status: "success" });
    return json({ status: "error", message: v.replace(/^error:/, "") });
  }

  return json({ status: "ok", form: "The Chief's Blueprint Registration" });
}
