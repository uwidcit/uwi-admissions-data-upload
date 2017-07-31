import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DegreeCardComponent } from './degree-card.component';

describe('DegreeCardComponent', () => {
  let component: DegreeCardComponent;
  let fixture: ComponentFixture<DegreeCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DegreeCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DegreeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
