import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecogidaComponent } from './recogida.component';

describe('RecogidaComponent', () => {
  let component: RecogidaComponent;
  let fixture: ComponentFixture<RecogidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecogidaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecogidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
