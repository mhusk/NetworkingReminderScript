var sheet = SpreadsheetApp.getActiveSheet();
var contacts = sheet.getDataRange().getValues().slice(1);

function MonthlyTrigger(){
  ScriptApp.newTrigger('EmailReminder')
  .timeBased()
  .onMonthDay(1)
  .atHour(8)
  .nearMinute(15)
  .inTimezone('America/New_York')
  .create();
}

function EmailReminder(){
  var recipient = "youremail@email.com";//Change this line!
  MailApp.sendEmail(recipient, "Networking Reminder", Email());
}

function SixMonthsSinceLastContact(){
  var noContactList = [];
  for(i = 0; i < contacts.length; i++){
    var row = i+2;
    var daysSinceLastContact = sheet.getRange(row,4);
    var nameOfContact = sheet.getRange(row, 1);
    if(daysSinceLastContact.getValue() == ''){
      daysSinceLastContact.setValue('=TODAY()-B'+row);
      if(daysSinceLastContact.getValue() > (30*6)){
        noContactList.push(nameOfContact.getValue());
      }
    } else{
      if(daysSinceLastContact.getValue() > (30*6)){
        noContactList.push(nameOfContact.getValue());
      }
    }
  }
  return noContactList;
}

function Email(){
  var listOfContacts = SixMonthsSinceLastContact();
  //Logger.log(listOfContacts);
  var introLine = "Michael,\n You haven't contacted:\n"
  var body = "";
  for(var i = 0; i<listOfContacts.length; i++){
    body += listOfContacts[i] + "\n";
  }
  body += "In 6 months\n";
  var googleSheet = '<a href="https://docs.google.com/spreadsheets/d/13Z0xyLhiJFRhiX9RswhUbXdbgsgK9mDECdGLx16ykow/edit#gid=0">Networking Google Sheet</a>'
  return introLine+body+googleSheet;
}
