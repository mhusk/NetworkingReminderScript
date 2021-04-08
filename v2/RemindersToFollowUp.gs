var appSettingsSheet = ss.getSheetByName('AppSettings');

function RemindersToFollowUp(){
  var reminderSettings = GetReminderData();
  var contactData = contactSheet.getDataRange().getValues().slice(1);
  for(var i = 0; i < contactData.length; i++){
    var daysWaitingForReply = contactData[i][5];
    var daysSinceReply = contactData[i][6];
    for(var j = 0; j < reminderSettings.length; j++){
      var reminder = reminderSettings[j];
      if(daysWaitingForReply == reminder){
        var message = contactData[i][0] + ' ' + contactData[i][1] + ' has not responded to your email in ' + reminder + ' days';
        sendSms(3173190559, message)
      } else if(daysSinceReply == reminder){
        var message = 'You have not replied to ' + contactData[i][0] + ' ' + contactData[i][1] +  ' email in ' + reminder + ' days';
        sendSms(3173190559, message);
      }
    }
  }
}

function GetReminderData(){
  var dataRange = appSettingsSheet.getDataRange().getValues();
  var reminderCadence = [];
  for(var i = 0; i < dataRange.length; i++){
    var cadence = dataRange[i][1];
    reminderCadence.push(cadence);
  }
  return reminderCadence;
}
