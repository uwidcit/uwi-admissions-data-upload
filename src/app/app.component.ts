import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { PapaParseService, PapaParseResult } from 'ngx-papaparse';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { Programme, Requirements } from './models/programme';
import { Row } from './models/row'
import { RowError, ColumnError } from './models/errors'
import { RowValidator } from './data/validators'
import { ProgrammeDataSource } from './data/data-source'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  private programmesDataSource: ProgrammeDataSource;
  private displayedColumns = ['Degree1', 'Degree2', 'Programme', 'Faculty', 'FullTime', 'PartTime', 'Evening', 'CXCPasses', 'CAPEPasses', 'AlternativeQualifications', 'OtherRequirements', 'Description'];
  private programmes: FirebaseListObservable<Programme[]>;
  private rowErrors: FirebaseListObservable<RowError[]>;
  private fileUploadBox: HTMLInputElement;
  @ViewChild('filter') filter: ElementRef;
  
  constructor(private database: AngularFireDatabase, private papa: PapaParseService){
    this.programmesDataSource = new ProgrammeDataSource();
    this.programmes = database.list('/Programmes');
    this.programmes.subscribe((programmes: Programme[]) => {
      this.programmesDataSource.programmes = programmes;
    });
    this.rowErrors = database.list('/RowErrors');
  }

  ngOnInit(){
    this.fileUploadBox = document.querySelector('#upload') as HTMLInputElement;

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          if (this.programmesDataSource) 
              this.programmesDataSource.filter = this.filter.nativeElement.value;
        });
  }

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
  }

  /**
   * Open the file selector for the file upload box
   */
  private triggerUploadDialog(){
    let fileUpload: any = document.querySelector('#upload');
    fileUpload.click();
  }

  /**
   * Upload the CSV file and produce Programmes to be put in the database 
   */
  private uploadFile(event: MouseEvent){
    let file = this.fileUploadBox.files[0];
    this.papa.parse(file, {
      complete: (result: PapaParseResult) => {
        let rows = result.data;
        //console.log('Headings', rows[0]);
        let programmes: Programme[] = [];
        let rowErrors: RowError[] = [];
        for(let i = 1, row = rows[i], end = rows.length - 1; i < end; i++, row = rows[i]){
          let rowError = RowValidator.validateRow(i + 1, row);
          if(rowError === null){
            let programme = this.createProgrammeFromRow(row);
            programmes.push(this.cleanProgrammeValues(programme));
          }else{
            rowErrors.push(rowError);
          }
        }
        //console.log(programmes, rowErrors);
        this.updateProgammesInDatabase(programmes, rowErrors);
      }
    });
  }

  private cleanProgrammeValues(programme: Programme) : Programme{
    for(let x in programme) {
      if(typeof(programme[x]) === 'string') continue;
      else if(isNaN(programme[x])) delete programme[x];
    }
    return programme;
  }

  private updateProgammesInDatabase(programmes: Programme[], rowErrors: RowError[]){
    this.programmes.remove();
    for(let programme of programmes) this.programmes.push(programme);
    this.rowErrors.remove()
    for(let rowError of rowErrors) this.rowErrors.push(rowError);
  }

  private extractRequirements(programme: Programme, type: string) : Requirements { 
      return {
          type: type,
          Passes: programme[type + 'Passes'],
          Mandatory: programme[type + 'Mandatory'],
          Any1of: programme[type + 'Any1of'],
          Any2of: programme[type + 'Any2of'],
          Any3of: programme[type + 'Any3of'],
          Any4of: programme[type + 'Any4of'],
          Any5of: programme[type + 'Any5sof'],
      };
  }

  private extractCSECRequirements(programme: Programme) : Requirements {
      return this.extractRequirements(programme, 'CSEC');
  }

  private extractCAPERequirements(programme: Programme) : Requirements {
      return this.extractRequirements(programme, 'CAPE');
  }

}
