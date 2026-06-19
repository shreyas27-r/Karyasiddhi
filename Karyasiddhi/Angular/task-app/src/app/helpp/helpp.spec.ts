import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelppComponent } from './helpp.component';

describe('Helpp', () => {
  let component: HelppComponent;
  let fixture: ComponentFixture<HelppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HelppComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
