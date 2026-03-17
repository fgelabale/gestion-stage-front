import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagiaireBilanStageForm } from './stagiaire-bilan-stage-form';

describe('StagiaireBilanStageForm', () => {
  let component: StagiaireBilanStageForm;
  let fixture: ComponentFixture<StagiaireBilanStageForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StagiaireBilanStageForm],
    }).compileComponents();

    fixture = TestBed.createComponent(StagiaireBilanStageForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
