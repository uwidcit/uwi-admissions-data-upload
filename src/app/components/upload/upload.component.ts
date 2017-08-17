import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { NgTableComponent } from 'ng2-expanding-table'
import { Programme, Requirements } from '../../models/programme';
import { RowError } from '../../models/errors';
import { RowContentComponent } from './row-content.component'

@Component({
  selector: 'uwi-admissions-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  private programmes: FirebaseListObservable<Programme[]>;
  private rowErrors: FirebaseListObservable<RowError[]>;
  private fileUpload: HTMLInputElement;
  @ViewChild('table') table: NgTableComponent;

  private tableConfig = {
    className: ['table-striped', 'table-bordered']
  };
  private columns = [
    {title: "Degree", name: "Degree1"},
    {title: "Level", name: "Degree2"},
    {title: "Programme", name: "Programme"},
    {title: "Faculty", name: "Faculty"},
    {title: "Full Time", name: "FullTime"},
    {title: "Part Time", name: "PartTime"},
    {title: "Evening", name: "Evening"},
    {title: "CSEC Passes", name: "CSECPasses"},
    {title: "CAPE Passes", name: "CAPEPasses"},
    {title: "Other Requirements", name: "OtherRequirements"},
    {title: "Alternative Qualifications", name: "AlternativeQualifications"},
    {title: "Description", name: "Description"},
  ];
  private rowComponent = RowContentComponent;
  private selectedRow = {
    CSECPasses: 0,
    CSECMandatory: '',
    CSECAny1Of: '',
    CSECAny2Of: '',
    CSECAny3Of: '',
    CSECAny4Of: '',
    CSECAny5Of: '',
    CAPEPasses: 0,
    CAPEMandatory: '',
    CAPEAny1Of: '',
    CAPEAny2Of: '',
    CAPEAny3Of: '',
    CAPEAny4Of: '',
    CAPEAny5Of: '',
  };
  
  constructor(private database: AngularFireDatabase){
    this.programmes = database.list('/Programmes');
    this.rowErrors = database.list('/RowErrors');
  }

  ngOnInit(){
    this.fileUpload = document.querySelector('#upload') as HTMLInputElement;
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

  /**
   * Set the data that will be show in the expanded row
   * @param data 
   */
  private exapndRow(data){
    console.log(data);
    if(data === undefined || data.row === undefined) return;
    let row = data.row;

    this.selectedRow.CSECPasses = row.CSECPasses;
    this.selectedRow.CSECMandatory = row.CSECMandatory;
    this.selectedRow.CSECAny1Of = row.CSECAny1of;
    this.selectedRow.CSECAny2Of = row.CSECAny2of;
    this.selectedRow.CSECAny3Of = row.CSECAny3of;
    this.selectedRow.CSECAny4Of = row.CSECAny4of;
    this.selectedRow.CSECAny5Of = row.CSECAny5of;

    this.selectedRow.CAPEPasses = row.CAPEPasses;
    this.selectedRow.CAPEMandatory = row.CAPEMandatory;
    this.selectedRow.CAPEAny1Of = row.CAPEAny1of;
    this.selectedRow.CAPEAny2Of = row.CAPEAny2of;
    this.selectedRow.CAPEAny3Of = row.CAPEAny3of;
    this.selectedRow.CAPEAny4Of = row.CAPEAny4of;
    this.selectedRow.CAPEAny5Of = row.CAPEAny5of;
  }

}