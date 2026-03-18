import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEtudiantCreate } from './admin-etudiant-create';

describe('AdminEtudiantCreate', () => {
  let component: AdminEtudiantCreate;
  let fixture: ComponentFixture<AdminEtudiantCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEtudiantCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminEtudiantCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
