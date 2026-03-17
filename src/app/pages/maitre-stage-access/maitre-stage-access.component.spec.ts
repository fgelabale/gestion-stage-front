import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaitreStageAccess } from './maitre-stage-access-component';

describe('MaitreStageAccess', () => {
  let component: MaitreStageAccess;
  let fixture: ComponentFixture<MaitreStageAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaitreStageAccess],
    }).compileComponents();

    fixture = TestBed.createComponent(MaitreStageAccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
