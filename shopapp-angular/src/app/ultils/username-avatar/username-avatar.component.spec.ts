import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernameAvatarComponent } from './username-avatar.component';

describe('UsernameAvatarComponent', () => {
  let component: UsernameAvatarComponent;
  let fixture: ComponentFixture<UsernameAvatarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsernameAvatarComponent]
    });
    fixture = TestBed.createComponent(UsernameAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
