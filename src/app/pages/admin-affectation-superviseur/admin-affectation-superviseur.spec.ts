import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAffectationSuperviseurComponent } from './admin-affectation-superviseur';

describe('AdminAffectationSuperviseur', () => {
  let component: AdminAffectationSuperviseurComponent;
  let fixture: ComponentFixture<AdminAffectationSuperviseurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAffectationSuperviseurComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAffectationSuperviseurComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
