import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapturaDatosComponent } from './captura-datos.component';

describe('CapturaDatosComponent', () => {
  let component: CapturaDatosComponent;
  let fixture: ComponentFixture<CapturaDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapturaDatosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapturaDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
