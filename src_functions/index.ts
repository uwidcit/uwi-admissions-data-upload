import * as functions  from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp(functions.config().firebase);
const database = admin.database();
const gcs = require('@google-cloud/storage')();
import * as fs from 'mz/fs';
const papaParse = require('papaparse');

import { Row } from './models/row'
import { Programme } from './models/programme';
import { RowError } from './models/errors'
import { RowValidator } from './validators/validators'

function cleanProgrammeValues(programme: Programme) : Programme{
  for(let x in programme) {
    if(typeof(programme[x]) === 'string') continue;
    else if(isNaN(programme[x])) delete programme[x];
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
          {Degree1:                    row[ 0],
          Degree2:                    row[ 1],
          Programme:                  row[ 2],
          Faculty:                    row[ 3],
          FullTime: !!Number.parseInt(row[ 4]),
          PartTime: !!Number.parseInt(row[ 5]),
          Evening:  !!Number.parseInt(row[ 6]),
          CSECPasses: Number.parseInt(row[ 7]),
          CSECMandatory:              row[ 8],
          CSECAny1of:                 row[ 9],
          CSECAny2of:                 row[10],
          CSECAny3of:                 row[11],
          CSECAny4of:                 row[12],
          CSECAny5of:                 row[13],
          CAPEPasses: Number.parseInt(row[14]),
          CAPEMandatory:              row[15],
          CAPEAny1of:                 row[16],
          CAPEAny2of :                row[17],
          CAPEAny3of:                 row[18],
          CAPEAny4of:                 row[19],
          CAPEAny5of:                 row[20],
          AlternativeQualifications:  row[21],
          OtherRequirements:          row[22],
          Description:                row[23]};
  return cleanProgrammeValues(programme);
}

exports.parseCSV = functions.storage.object().onChange(event => {
  let object = event.data;
  let filePath = object.name;
  let fileName = filePath.split('/').pop();
  let fileBucket = object.bucket;
  let bucket = gcs.bucket(fileBucket);
  let tempFilePath = `/tmp/${fileName}`;

  if(object.contentType !== 'application/vnd.ms-excel') return;
  if(object.resourceState === 'not_exists') return;

  return bucket.file(filePath).download({
    destination: tempFilePath
  })
  .then(() => {
    return fs.readFile(tempFilePath, {encoding: 'utf-8'});
  })
  .then(csv => {
    papaParse.parse(csv, {
      complete: (result) => {
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
        let rootRef = database.ref('/'), programmesRef = rootRef.child('/Programmes'), rowErrorsRef = rootRef.child('/RowErrors');
        // programmesRef.remove();
        // rowErrorsRef.remove()
        return rootRef.update({
          Programmes: programmes,
          RowErrors: rowErrors
        });
      }
    });
  });
});
