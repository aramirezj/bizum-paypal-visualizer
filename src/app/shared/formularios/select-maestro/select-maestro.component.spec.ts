import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMaestroComponent } from './select-maestro.component';

describe('SelectMaestroComponent', () => {
  let component: SelectMaestroComponent;
  let fixture: ComponentFixture<SelectMaestroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectMaestroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMaestroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
