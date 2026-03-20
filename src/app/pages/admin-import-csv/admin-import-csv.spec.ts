import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminImportCsv } from './admin-import-csv';

describe('AdminImportCsv', () => {
  let component: AdminImportCsv;
  let fixture: ComponentFixture<AdminImportCsv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminImportCsv],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminImportCsv);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
