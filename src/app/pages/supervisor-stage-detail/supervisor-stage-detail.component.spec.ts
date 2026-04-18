import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorStageDetailComponent } from './supervisor-stage-detail.component';

describe('SupervisorStageDetailComponent', () => {
  let component: SupervisorStageDetailComponent;
  let fixture: ComponentFixture<SupervisorStageDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupervisorStageDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SupervisorStageDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
