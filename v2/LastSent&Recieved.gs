var lastSent_COL = 4;
var lastRecieved_COL = 5;

//Can simplify this into basically one function.

function LastSentLastRecieved(){
  var sentThreads = GetThreads(50, 'sent');
  var recievedThreads = GetThreads(50,'inbox');
  var contacts = GetContacts(ss);
  var lastestCheckRecieved = GetDateOfLastContact(recievedThreads,contacts,true);
  var lastestCheckSent = GetDateOfLastContact(sentThreads, contacts,false);
  UpdateLastContact(lastestCheckRecieved, ss.getSheetByName('contacts'),5);
  UpdateLastContact(lastestCheckSent, ss.getSheetByName('contacts'),4);
}

/**
 * This will go through the contacts list and then fill in the last day someone from your contact list sent you an email or the last 
 * time you sent them an email.
 * @param {GmailApp.GmailThread[]} threads - an array of emails
 * @param {Object[][]} contacts - a list of contacts
 * @param {bool} type - true for inbox emails, false is for sent emails
 */
function GetDateOfLastContact(threads, contacts, type){
  var contactEmails = GetEmails(contacts);
  var resultsArray = [];
  for(var j = 0; j < contactEmails.length; j++){
    var currentEmail = contactEmails[j];
    for(var k = 0; k < threads.length; k++){
      var dateRecieved = threads[k].getLastMessageDate();
      if(type == true){
        var sender = threads[k].getMessages()[0].getFrom().split("<");
      } else{
        var sender = threads[k].getMessages()[0].getTo().split("<");
      }
      
      if(sender.length == 1){
        sender = sender[0];
      } else{
        sender = sender[1].slice(0,-1);
      }
      if(sender == currentEmail){
        resultsArray.push([dateRecieved, sender]);
      }
    }
  }
  var uniqueArray = RemoveEarlierDuplicates(resultsArray);
  return uniqueArray;
}

/**
 * Will update each contact and the date when the latest email was recieved.
 * @param {(Date | string[])[][]} latest - an array that includes the latest contact and email.
 * @param {SpreadsheetApp.Sheet} sheet - a sheet with a list of contacts.
 * @param {int} col - the column in the sheet to be updated.
 */
function UpdateLastContact(latest, sheet, col){
  var lastRow = sheet.getDataRange().getLastRow();
  for(var i = 0; i < latest.length; i++){
    var sender = latest[i][1];
    var date = latest[i][0]
    for(var j = 2; j < lastRow+1; j++){
      var contact = sheet.getRange(j,3).getValue();
      if(contact == sender){
        sheet.getRange(j,col).setValue(date);
      }
    }
  }
}

/**
 * Will remove duplicates of emails that were recieved on earlier dates.
 * @param {(Date | string[])[][]} arr - an array that includes the latest contact and email.
 */
function RemoveEarlierDuplicates(arr){
  var results = [];
  var senderArr = [];
  for(var i = 0; i < arr.length; i++){
    senderArr.push(arr[i][1]);
  }
  //Logger.log(senderArr);
  for(var j = 0; j < senderArr.length; j++){
    var sender = senderArr[j];
    var index = senderArr.indexOf(sender);
    results.push(arr[index]);
  }
  //Logger.log(results);
  let uniqueResults = results.filter((c,index)=> {
    return results.indexOf(c) === index;
  })
  return uniqueResults;
}

/**
 * This will go through the contacts list and then fill in the last day someone from your contact list sent you an email.
 * @param {GmailApp.GmailThread[]} threads - an array of emails
 * @param {Object[][]} contacts - a list of contacts
 */
function GetDateOfLastRecieved(threads, contacts){
  //var today = getToday();
  var contactEmails = GetEmails(contacts);
  var resultsArray = [];
  for(var j = 0; j < contactEmails.length; j++){
    var currentEmail = contactEmails[j];
    for(var k = 0; k < threads.length; k++){
      var dateRecieved = threads[k].getLastMessageDate();
      var sender = threads[k].getMessages()[0].getFrom().split("<");
      if(sender.length == 1){
        sender = sender[0];
      } else{
        sender = sender[1].slice(0,-1);
      }
      if(sender == currentEmail){
        resultsArray.push([dateRecieved, sender]);
      }
    }
  }
  var uniqueArray = RemoveEarlierDuplicates(resultsArray);
  return uniqueArray;
}

/**
 * This will return an array of the emails from the contacts
 * @param {Object[][]} contacts - a list of contacts
 */
function GetEmails(contacts){
  var results = [];
  for(var i = 0; i < contacts.length; i++){
    results.push(contacts[i][2]);
  }
  return results;
}

/**
 * This will get the contacts from a Spreadsheet
 * @param {SpreadsheetApp.Spreadsheet} spreadSheet
 */
function GetContacts(spreadSheet){
  var contactSheet = spreadSheet.getSheetByName('contacts');
  if(contactSheet == null){
    Logger.log('Incorrect Sheet Name on GetContacts function.');
    return;
  }
  return contactSheet.getDataRange().getValues().slice(1);
}


/**
 * This will get messages from your inbox or your sent mail part of your gmail
 * @param {number} num - number of emails you want to retrieve.
 * @param {string} type - 'inbox' or 'sent'
 */
function GetThreads(num, type){
  if(type == 'inbox'){
    var results = GmailApp.getInboxThreads(0, num);
    return results;
  } else if(type ='sent'){
    var results = GmailApp.search("in:sent", 0, num);
    return results;
  } else{
    Logger.log('error in GetThreads_Beta');
  }
}

/**
 * Get the last {num} sent messages
 * @param {int} num - number of messages
 */
function GetSentThreads(num){
  var threads = GmailApp.search("in:sent", 0, num); 
  return threads;
}

