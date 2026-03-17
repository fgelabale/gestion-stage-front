import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagiaireBilanMiStageForm } from './stagiaire-bilan-mi-stage-form';

describe('StagiaireBilanMiStageForm', () => {
  let component: StagiaireBilanMiStageForm;
  let fixture: ComponentFixture<StagiaireBilanMiStageForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StagiaireBilanMiStageForm],
    }).compileComponents();

    fixture = TestBed.createComponent(StagiaireBilanMiStageForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
