import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAptComponent } from './edit-apt.component';

describe('EditAptComponent', () => {
  let component: EditAptComponent;
  let fixture: ComponentFixture<EditAptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
