import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomupVisComponent } from './bottomup-vis.component';

describe('BottomupVisComponent', () => {
  let component: BottomupVisComponent;
  let fixture: ComponentFixture<BottomupVisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BottomupVisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomupVisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
