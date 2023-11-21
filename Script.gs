function generateDoc() {
  // Read sheet
  var spreadsheetID = "SPREADSHEET_ID";  // Notice they are different objects
  var sheet = SpreadsheetApp.openById(sheetID).getSheetByName("SHEET_NUMBER");
  var data = sheet.getDataRange().getValues();
  var lastLine = data.length;
  var data = data[lastLine - 1];  // Loads last line as a list
  Logger.log('Reading sheet... OK');

  // Generate test map (customize your items)
  var osMap = {
    '{{ITEM1}}': data[0],
    '{{ITEM2}}': data[1]  
  }
  Logger.log('Texts... OK');

  // Clone example Doc
  var stdDoc = DriveApp.getFileById('doc_id');
  var clone = stdDoc.makeCopy(data[1].toString());  //ID
  var newDoc = DocumentApp.openById(clone.getId());
  Logger.log('Cloning... OK');

  // Replace {{variables}} with texts
  for (var sub in osMap) {
    var textSub = osMap[sub];
    newDoc.getBody().replaceText(sub, textSub);
  }
  //Date on footer 
  var dateNow = Utilities.formatDate(new Date(), 'UTC-3', 'dd/MM/yyyy');  // Change timezone and date format
  newDoc.getFooter().replaceText('{{DATA}}', dateNow);
  newDoc.saveAndClose();
  Logger.log('Text changes... OK');

  // E-mail when finishes
  var message = 'A new order has been submited!\n' +
                'Referrer: ' + data[2] + '\n\n' +
                'Click here to edit: \n' + newDoc.getUrl();
  GmailApp.sendEmail('user@email.com', 'New order: '+data[1].toString(), message);
  Logger.log('Send e-mail... OK');
}
