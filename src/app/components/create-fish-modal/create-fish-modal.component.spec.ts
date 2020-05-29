import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFishModalComponent } from './create-fish-modal.component';

describe('CreateFishModalComponent', () => {
  let component: CreateFishModalComponent;
  let fixture: ComponentFixture<CreateFishModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFishModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFishModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
