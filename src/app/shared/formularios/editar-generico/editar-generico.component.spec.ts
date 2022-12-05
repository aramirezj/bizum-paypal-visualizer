import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditarGenericoComponent } from './editar-generico.component';

describe('EditarGenericoComponent', () => {
  let component: EditarGenericoComponent;
  let fixture: ComponentFixture<EditarGenericoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarGenericoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarGenericoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
