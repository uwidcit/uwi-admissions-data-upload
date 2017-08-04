import { DataSource } from '@angular/cdk';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { Programme } from '../models/programme'

export class ProgrammeDataSource extends DataSource<any> {
  private _programmes: Programme[] = [];
  get programmes() { return this._programmes};
  set programmes(programmes: Programme[]) {
    this._programmes = programmes;
    this.dataChange.next(programmes);
  }
  private dataChange: BehaviorSubject<Programme[]> = new BehaviorSubject<Programme[]>([]);
  private filterChange = new BehaviorSubject('');
  get filter(): string { return this.filterChange.value; }
  set filter(filter: string) { this.filterChange.next(filter); }

  constructor() {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Programme[]> {
    return Observable.merge(this.dataChange, this.filterChange).map(() => {
      return this.dataChange.value.slice().filter((programme: Programme) => {
        let searchStr = (programme.Programme + programme.Faculty).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });
    });
  }

  disconnect() {}
}