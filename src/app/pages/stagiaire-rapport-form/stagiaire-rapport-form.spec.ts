import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagiaireRapportForm } from './stagiaire-rapport-form';

describe('StagiaireRapportForm', () => {
  let component: StagiaireRapportForm;
  let fixture: ComponentFixture<StagiaireRapportForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StagiaireRapportForm],
    }).compileComponents();

    fixture = TestBed.createComponent(StagiaireRapportForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
