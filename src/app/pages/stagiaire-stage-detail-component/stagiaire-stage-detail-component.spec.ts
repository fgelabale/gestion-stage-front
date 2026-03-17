import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagiaireStageDetailComponent } from './stagiaire-stage-detail-component';

describe('StagiaireStageDetailComponent', () => {
  let component: StagiaireStageDetailComponent;
  let fixture: ComponentFixture<StagiaireStageDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StagiaireStageDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StagiaireStageDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
