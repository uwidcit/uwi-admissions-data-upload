import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { PapaParseService, PapaParseResult } from 'ngx-papaparse';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { Programme, Requirements } from '../../models/programme';
import { RowError } from '../../models/errors'
import { ProgrammeDataSource } from '../../data/data-source'

@Component({
  selector: 'uwi-admissions-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  private programmesDataSource: ProgrammeDataSource;
  private displayedColumns = ['Degree1', 'Degree2', 'Programme', 'Faculty', 'FullTime', 'PartTime', 'Evening', 'CXCPasses', 'CAPEPasses', 'AlternativeQualifications', 'OtherRequirements', 'Description'];
  private programmes: FirebaseListObservable<Programme[]>;
  private rowErrors: FirebaseListObservable<RowError[]>;
  private fileUpload: HTMLInputElement;
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
    this.fileUpload = document.querySelector('#upload') as HTMLInputElement;

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          if (this.programmesDataSource) 
              this.programmesDataSource.filter = this.filter.nativeElement.value;
        });
  }

  /**
   * Open the file selector for the file upload box
   */
  private triggerUploadDialog(event: MouseEvent){
    this.fileUpload.click();
  }

  /**
   * Upload the CSV file and produce Programmes to be put in the database 
   */
  private uploadFile(event: Event){
    let form = new FormData();
    form.append('csv', this.fileUpload.files[0]);
    fetch('/upload_csv', {
      method: "POST",
      body: form
    });
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