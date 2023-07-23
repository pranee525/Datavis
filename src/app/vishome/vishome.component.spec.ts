import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VishomeComponent } from './vishome.component';

describe('VishomeComponent', () => {
  let component: VishomeComponent;
  let fixture: ComponentFixture<VishomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VishomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VishomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
