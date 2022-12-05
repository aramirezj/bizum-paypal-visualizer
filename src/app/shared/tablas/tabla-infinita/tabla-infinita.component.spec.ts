import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaInfinitaComponent } from './tabla-infinita.component';

describe('TablaInfinitaComponent', () => {
  let component: TablaInfinitaComponent;
  let fixture: ComponentFixture<TablaInfinitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaInfinitaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaInfinitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
