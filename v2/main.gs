var ss = SpreadsheetApp.getActiveSpreadsheet();

function onOpen(){
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Menu')
      .addItem('Run LastSent and Recieved', 'LastSentLastRecieved')
      .addItem('Run SinceLastContact', 'SinceLastContact')
      .addToUi();
}

function main(){
  LastSentLastRecieved();
  SinceLastContact();
  RemindersToFollowUp();
}
