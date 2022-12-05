import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementoTablaComponent } from './elemento-tabla.component';

describe('ElementoTablaComponent', () => {
  let component: ElementoTablaComponent;
  let fixture: ComponentFixture<ElementoTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElementoTablaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementoTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
