import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
const database = admin.database();
const gcs = require('@google-cloud/storage')();
const fs = require('mz/fs');
const babyParse = require('babyparse');
const expressApp = require('express')();
const multer = require('multer')({dest: '/tmp/'});

import { Row } from './models/row'
import { Programme } from './models/programme';
import { RowError } from './models/errors'
import { RowValidator } from './validators/validators'

/**
 * Remove any NaN from the programme since they can't be put in Firebase
 * @param programme The programme to be cleanned
 */
function cleanProgrammeValues(programme: Programme) : Programme{
  for(let x in programme) {
    if(typeof(programme[x]) !== 'string' && isNaN(programme[x])) delete programme[x];
  }
  return programme;
}

/**
 * Produce a Programme object from a row of the CSV file
 * @param row A row from the CSV file
 * @returns A Programme object based on the row passed in
 */
function createProgrammeFromRow(row: Row): Programme {
  let programme = 
     {Degree1:                    row[ 0].trim(),
      Degree2:                    row[ 1].trim(),
      Programme:                  row[ 2].trim(),
      Faculty:                    row[ 3].trim(),
      FullTime: !!Number.parseInt(row[ 4]),
      PartTime: !!Number.parseInt(row[ 5]),
      Evening:  !!Number.parseInt(row[ 6]),
      CSECPasses: Number.parseInt(row[ 7]),
      CSECMandatory:              row[ 8].trim(),
      CSECAny1of:                 row[ 9].trim(),
      CSECAny2of:                 row[10].trim(),
      CSECAny3of:                 row[11].trim(),
      CSECAny4of:                 row[12].trim(),
      CSECAny5of:                 row[13].trim(),
      CAPEPasses: Number.parseInt(row[14]),
      CAPEMandatory:              row[15].trim(),
      CAPEAny1of:                 row[16].trim(),
      CAPEAny2of :                row[17].trim(),
      CAPEAny3of:                 row[18].trim(),
      CAPEAny4of:                 row[19].trim(),
      CAPEAny5of:                 row[20].trim(),
      AlternativeQualifications:  row[21],
      OtherRequirements:          row[22],
      Description:                row[23]};
  return cleanProgrammeValues(programme);
}

/**
 * Parse the csv
 * @param csv 
 */
function parseCSV(csv: string) : Promise<void>{
  let result = babyParse.parse(csv);
  let rows = result.data;
  // console.log('Headings', rows[0]);
  let programmes: Programme[] = [];
  let rowErrors: RowError[] = [];
  for(let i = 1, row = rows[i], end = rows.length - 1; i < end; i++, row = rows[i]){
    let rowError = RowValidator.validateRow(i + 1, row);
    if(rowError === null){
      let programme = createProgrammeFromRow(row);
      programmes.push(cleanProgrammeValues(programme));
    }else{
      rowErrors.push(rowError);
    }
  }
  // console.log(programmes, rowErrors);
  return database.ref('/').update({
    Programmes: programmes,
    RowErrors: rowErrors,
    updateTime: Date.now()
  });
}

/**
 * Handle the file being uploaded to Firebase Storage
 */
exports.uploadCSV_storage = functions.storage.object().onChange(event => {
  let object = event.data;
  let filePath = object.name;
  let fileName = filePath.split('/').pop();
  let fileBucket = object.bucket;
  let bucket = gcs.bucket(fileBucket);
  let tempFilePath = `/tmp/${fileName}`;

  if(object.contentType !== 'application/vnd.ms-excel') return;
  if(object.resourceState === 'not_exists') return;

  return bucket.file(filePath).download({destination: tempFilePath})
  .then(() => fs.readFile(tempFilePath, {encoding: 'utf-8'}))
  .then(csv => parseCSV(csv));
});

/**
 * Handle the file being uploaded via the upload form
 */
expressApp.post('/upload_csv', multer.single('csv'), (request, response, next) => {
  let csv = request.file;
  let name = `${csv.destination}${csv.filename}`;
  return fs.readFile(name, {encoding: 'utf8'})
  .then(csv => parseCSV(csv))
  .then(() => response.send());
});

exports.uploadCSV_https = functions.https.onRequest(expressApp);

exports.uploadCSVPostProcess = functions.database.ref('/Programmes').onWrite(event => {
  if(!event.data.exists()) return;

  let programmes: Programme[] = event.data.val();
  let updates = {};

  const addToUpdates = (prefix: string, subject: string, key: string, programme: Programme) => {
    let splits = subject.split(' or ');
    for(let split of splits){
      let updateKey= `${prefix}_${split}`;
      if(updates[updateKey] === undefined) updates[updateKey] = {};
      updates[updateKey][key] = programme;
    }
  };
  
  for(let programme of programmes){
    let programmeKey = programme.Faculty + programme.Degree2 + programme.Programme;

    programme.CSECMandatory.split(',')
    .concat(programme.CSECAny1of.split(','))
    .concat(programme.CSECAny2of.split(','))
    .concat(programme.CSECAny3of.split(','))
    .concat(programme.CSECAny4of.split(','))
    .concat(programme.CSECAny5of.split(','))
    .map(subject => subject.trim().replace('.', ''))
    .filter(subject => subject)
    .forEach(subject => addToUpdates('CSEC', subject, programmeKey, programme));

    programme.CAPEMandatory.split(',')
    .concat(programme.CAPEAny1of.split(','))
    .concat(programme.CAPEAny2of.split(','))
    .concat(programme.CAPEAny3of.split(','))
    .concat(programme.CAPEAny4of.split(','))
    .concat(programme.CAPEAny5of.split(','))
    .map(subject => subject.trim().replace('.', ''))
    .filter(subject => subject)
    .forEach(subject => addToUpdates('CAPE', subject, programmeKey, programme));
  }

  return database.ref('/search').set(updates);
});

exports.newUser = functions.auth.user().onCreate(event => {
    let user = event.data;
    let { uid, email } = user;
    return database.ref(`/users/${uid}`).update({
      uid: uid,
      emial: email,
      name: `User ${uid}`
    });
  });