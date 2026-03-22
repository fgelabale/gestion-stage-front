import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagiaireStageCreate } from './stagiaire-stage-create';

describe('StagiaireStageCreate', () => {
  let component: StagiaireStageCreate;
  let fixture: ComponentFixture<StagiaireStageCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StagiaireStageCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(StagiaireStageCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
