import { Component, OnInit, Input } from '@angular/core';
import { Programme, Requirements } from '../../models/programme';

@Component({
  selector: 'uwi-admissions-requirements-card',
  templateUrl: './requirements-card.component.html',
  styleUrls: ['./requirements-card.component.css']
})
export class RequirementsCardComponent implements OnInit {
  @Input() private type: string;
  @Input() private requirements: Requirements;
  private showAny1of: boolean = false;
  private showAny2of: boolean = false;
  private showAny3of: boolean = false;
  private showAny4of: boolean = false;
  private showAny5of: boolean = false;

  private determineWhichToShow(){
    this.showAny1of = !!this.requirements.Any1of;
    this.showAny2of = !!this.requirements.Any2of;
    this.showAny3of = !!this.requirements.Any3of;
    this.showAny4of = !!this.requirements.Any4of;
    this.showAny5of = !!this.requirements.Any5of;
  }

  ngOnInit() {
    this.determineWhichToShow();
  }

}
