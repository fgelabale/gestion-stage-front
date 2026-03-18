import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagiaireBilanFinStageComponent } from './stagiaire-bilan-fin-stage';

describe('StagiaireBilanFinStage', () => {
  let component: StagiaireBilanFinStageComponent;
  let fixture: ComponentFixture<StagiaireBilanFinStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StagiaireBilanFinStageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StagiaireBilanFinStageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
