import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { PapaParseService, PapaParseResult } from 'ngx-papaparse';
import { Programme } from './models/programme';
import { Row } from './models/row'
import { RowError, ColumnError } from './models/errors'
import { RowValidator } from './models/validators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  private programmes: FirebaseListObservable<Programme[]>;
  private fileUploadBox: HTMLInputElement;
  
  constructor(private database: AngularFireDatabase, private papa: PapaParseService){
    this.programmes = database.list('/Programmes');
  }

  ngOnInit(){
    this.fileUploadBox = document.querySelector('#upload') as HTMLInputElement;
  }

  /**
   * Validate that the row meets valid criteria
   * @param rowNum The number of the row in the in the CSV file
   * @param row The row to validate
   * @returns A RowError object of the errors or null if no errors exist
   */
  

  /**
   * Produce a Programme object from a row of the CSV file
   * @param row A row from the CSV file
   * @returns A Programme object based on the row passed in
   */
  private createProgrammeFromRow(row: Row): Programme {
    return {Degree1:                    row[ 0],
            Degree2:                    row[ 1],
            Programme:                  row[ 2],
            Faculty:                    row[ 3],
            FullTime:                 !!row[ 4],
            PartTime:                 !!row[ 5],
            Evening:                  !!row[ 6],
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
            AlternateQualifications:    row[21],
            OtherRequirements:          row[22],
            Description:                row[23]};
  }

  /**
   * Open the file selector for the file upload box
   */
  triggerUploadDialog(){
    let fileUpload: any = document.querySelector('#upload');
    fileUpload.click();
  }

  /**
   * Upload the CSV file and produce Programmes to be put in the database 
   */
  uploadFile(event: Event){
    let file = this.fileUploadBox.files[0];
    this.papa.parse(file, {
      complete: (result: PapaParseResult) => {
        let rows = result.data;
        //console.log('Headings', rows[0]);
        let programmes: Programme[] = [];
        let rowErrors: RowError[] = [];
        for(let i = 1, row = rows[i], end = rows.length - 1; i < end; i++, row = rows[i]){
          // let rowError = RowValidator.validateRow(i + 1, row);
          // if(rowError === null){
          //   let programme = this.createProgrammeFromRow(row);
          //   programme = this.cleanProgrammeValues(programme);
          //   programmes.push(programme);
          // }else{
          //   rowErrors.push(rowError);
          // }
          let programme = this.cleanProgrammeValues(this.createProgrammeFromRow(row));
          programmes.push(programme);
        }
        console.log(programmes);
        //console.log(rowErrors);
        this.updateProgammesInDatabase(programmes);
      }
    });
  }

  private cleanProgrammeValues(programme: Programme) : Programme{
    for(let x in programme) {
      if(typeof(programme[x]) === "string") continue;
      else if(isNaN(programme[x])) delete programme[x];
    }
    return programme;
  }

  private updateProgammesInDatabase(programmes: Programme[]){
    this.programmes.remove();
    for(let programme of programmes) this.programmes.push(programme);
  }


}
