import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAptComponent } from './create-apt.component';

describe('CreateAptComponent', () => {
  let component: CreateAptComponent;
  let fixture: ComponentFixture<CreateAptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
