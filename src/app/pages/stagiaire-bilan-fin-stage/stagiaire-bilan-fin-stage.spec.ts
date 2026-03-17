import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagiaireBilanFinStage } from './stagiaire-bilan-fin-stage';

describe('StagiaireBilanFinStage', () => {
  let component: StagiaireBilanFinStage;
  let fixture: ComponentFixture<StagiaireBilanFinStage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StagiaireBilanFinStage],
    }).compileComponents();

    fixture = TestBed.createComponent(StagiaireBilanFinStage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
