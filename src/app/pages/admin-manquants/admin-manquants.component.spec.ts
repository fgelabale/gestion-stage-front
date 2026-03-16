import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManquantsComponent } from './admin-manquants.component';

describe('AdminManquants', () => {
  let component: AdminManquantsComponent;
  let fixture: ComponentFixture<AdminManquantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminManquantsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminManquantsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
