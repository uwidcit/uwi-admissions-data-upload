import { Component, OnInit, Input } from '@angular/core';
import { Requirements } from '../../models/programme';

@Component({
  selector: 'uwi-admissions-row',
  templateUrl: './row-content.component.html',
})
export class RowContentComponent implements OnInit {
  
  @Input() CSECPasses;
  @Input() CSECMandatory;
  @Input() CSECAny1of;
  @Input() CSECAny2of;
  @Input() CSECAny3of;
  @Input() CSECAny4of;
  @Input() CSECAny5of;

  @Input() CAPEPasses;
  @Input() CAPEMandatory;
  @Input() CAPEAny1of;
  @Input() CAPEAny2of;
  @Input() CAPEAny3of;
  @Input() CAPEAny4of;
  @Input() CAPEAny5of;

  ngOnInit() {
  }

}
