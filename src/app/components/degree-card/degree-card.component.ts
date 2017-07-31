import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database'
import { Programme, Requirements } from '../../models/programme'

@Component({
  selector: 'uwi-admissions-degree-card',
  templateUrl: './degree-card.component.html',
  styleUrls: ['./degree-card.component.css']
})
export class DegreeCardComponent implements OnInit {

  @Input() private programme: Programme;
  private showContent: boolean = false;
  private showCXC: boolean = false;
  private showCSEC: boolean = false;
  private showCAPE: boolean = false;

  constructor(private database: AngularFireDatabase) {
  }

  ngOnInit() {
    this.database.list('/Progammes')
  }

  toggleShowContent(){
    this.showContent = !this.showContent;
  }

  private extractRequirements(type: string) : Requirements { 
      return {
          type: type,
          Passes: this.programme[type + "Passes"],
          Mandatory: this.programme[type + "Mandatory"],
          Any1of: this.programme[type + "Any1of"],
          Any2of: this.programme[type + "Any2of"],
          Any3of: this.programme[type + "Any3of"],
          Any4of: this.programme[type + "Any4of"],
          Any5of: this.programme[type + "Any5sof"],
      };
  }

  extractCSECRequirements() : Requirements {
      return this.extractRequirements("CSEC");
  }

  extractCAPERequirements() : Requirements {
      return this.extractRequirements("CAPE");
  }

}
