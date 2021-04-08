var contactSheet = ss.getSheetByName('contacts');
var daysWaitingForReply_COL = 6; 
var daysConnectionIsWaitingForAResponse_COL = 7;

function SinceLastContact(){
  var contacts = GetContacts(ss);
  for(var i = 0; i < contacts.length; i++){
    var row = i+2;
    var lastSent = contacts[i][3];
    var lastRecieved = contacts[i][4];
    DaysSinceLastContact(row, lastSent, lastRecieved)
  } 
}

/**
 * Will set the days you have been waiting for a response or you have been waiting to send an email.
 * @param {number} row
 * @param {Object} sent - last sent date
 * @param {Object} recieved - last time recieved a message
 */
function DaysSinceLastContact(row, sent, recieved){
  var today = new Date();
  if(sent > recieved){
    SetCellValue(row, daysConnectionIsWaitingForAResponse_COL,'clear',contactSheet);
    //contactSheet.getRange(row, daysConnectionIsWaitingForAResponse_COL).clear();
    var difference = ConvertDifferenceToDays(today - sent);
    SetCellValue(row, daysWaitingForReply_COL, 'set', contactSheet, difference );
  } else if(recieved > sent){
    SetCellValue(row, daysWaitingForReply_COL, 'clear',contactSheet);
    //contactSheet.getRange(row, daysWaitingForReply_COL).clear();
    var difference = ConvertDifferenceToDays(today - recieved);
    SetCellValue(row, daysConnectionIsWaitingForAResponse_COL, 'set', contactSheet, difference);
  } else{
    Logger.log('An issue with the DaysSinceLastContact variables');
  }
}

/**
 * @param {number} row - row of cell. Index starts at 1
 * @param {number} col - column of cell. Index starts at 1
 * @param {string} type - "clear" or "set"
 * @param {SpreadsheetApp.Sheet} sheet - the sheet that you want change values on.
 * @param {any} value - what you want to put into the cell.
 */
function SetCellValue(row, col, type, sheet, value){
  var cell = sheet.getRange(row, col);
  if(type == 'clear'){
    cell.clear();
  } else if(type == 'set'){
    cell.setValue(value);
  } else{
    Logger.log('SetCellValue did not have a correct type');
  }
}

/**
 * Will convert the difference in milliseconds to a whole number of days.
 */
function ConvertDifferenceToDays(diff){
  var result = diff / (1000*60*60*24)
  //Logger.log(result.toFixed());
  return result.toFixed();
}
