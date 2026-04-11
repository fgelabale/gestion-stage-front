import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaitreStageAccessComponent } from './maitre-stage-access.component';

describe('MaitreStageAccess', () => {
  let component: MaitreStageAccessComponent;
  let fixture: ComponentFixture<MaitreStageAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaitreStageAccessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MaitreStageAccessComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
