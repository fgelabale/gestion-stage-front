import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagiaireBilanMiStageComponent } from './stagiaire-bilan-mi-stage-form';

describe('StagiaireBilanMiStageComponent', () => {
  let component: StagiaireBilanMiStageComponent;
  let fixture: ComponentFixture<StagiaireBilanMiStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StagiaireBilanMiStageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StagiaireBilanMiStageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
