import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSuperviseurs } from './admin-superviseurs';

describe('AdminSuperviseurs', () => {
  let component: AdminSuperviseurs;
  let fixture: ComponentFixture<AdminSuperviseurs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSuperviseurs],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSuperviseurs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
