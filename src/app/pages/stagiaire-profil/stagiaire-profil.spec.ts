import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagiaireProfil } from './stagiaire-profil';

describe('StagiaireProfil', () => {
  let component: StagiaireProfil;
  let fixture: ComponentFixture<StagiaireProfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StagiaireProfil],
    }).compileComponents();

    fixture = TestBed.createComponent(StagiaireProfil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
