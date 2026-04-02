import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagiaireStageCreateComponent } from './stagiaire-stage-create';

describe('StagiaireStageCreate', () => {
  let component: StagiaireStageCreateComponent;
  let fixture: ComponentFixture<StagiaireStageCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StagiaireStageCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StagiaireStageCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
