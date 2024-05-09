import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupListFormComponent } from './group-list-form.component';

describe('GroupListFormComponent', () => {
  let component: GroupListFormComponent;
  let fixture: ComponentFixture<GroupListFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupListFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupListFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
