import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccionTablaComponent } from './accion-tabla.component';

describe('AccionTablaComponent', () => {
  let component: AccionTablaComponent;
  let fixture: ComponentFixture<AccionTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccionTablaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccionTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
