/**
 * Google Apps Script for WB2026 Form Integration
 * Paste this into a separate Google Apps Script project (Extensions > Apps Script in a Google Sheet).
 */

const FOLDER_ID = 'YOUR_GOOGLE_DRIVE_FOLDER_ID'; // Replace with your Drive directoy ID

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Responses') || ss.insertSheet('Responses');
    
    // Set headers if new sheet
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'Full Name', 'Age', 'Gender', 'Father\'s Name', 
        'Address', 'District', 'Vidhansabha', 'Qualification', 
        'Political Comfort', 'Outbound Exp', 'Exp Years', 
        'Bengali Proficiency', 'Timing Comfort', 'Resume Link', 
        'Voice Recording Link', 'MCQ Score'
      ]);
    }

    // Handle File Uploads (Resume & Voice)
    let resumeUrl = '';
    let voiceUrl = '';

    if (data.resumeBase64) {
      resumeUrl = saveFile(data.resumeBase64, data.resumeName, data.resumeType);
    }
    
    if (data.voiceBase64) {
      voiceUrl = saveFile(data.voiceBase64, `voice_${Date.now()}.webm`, 'audio/webm');
    }

    // Append response to sheet
    sheet.appendRow([
      new Date(),
      data.fullName,
      data.age,
      data.gender,
      data.fatherName,
      data.address,
      data.district,
      data.vidhansabha,
      data.qualification,
      data.politicalComfort,
      data.outboundExp,
      data.expYears,
      data.bengaliProficiency,
      data.timingComfort,
      resumeUrl,
      voiceUrl,
      data.mcqScore || 0
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function saveFile(base64Data, filename, mimeType) {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const decoded = Utilities.base64Decode(base64Data.split(',')[1]);
  const blob = Utilities.newBlob(decoded, mimeType, filename);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}
