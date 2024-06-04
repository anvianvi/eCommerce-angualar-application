import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthenticationService } from '../core/services/authentication.service';
import { ProfileStatusBarComponent } from './profile-status-bar.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProfileStatusBarComponent', () => {
  let component: ProfileStatusBarComponent;
  let fixture: ComponentFixture<ProfileStatusBarComponent>;
  let authenticationService: AuthenticationService;
  let router: Router;

  beforeEach(async () => {
    // Mock the AuthenticationService
    authenticationService = {
      logout: jest.fn(),
    } as unknown as AuthenticationService;

    // Mock the Router
    router = {
      navigate: jest.fn(),
    } as unknown as Router;

    await TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatMenuModule,
        NoopAnimationsModule,
        ProfileStatusBarComponent, // Import the standalone component
      ],
      providers: [
        { provide: AuthenticationService, useValue: authenticationService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileStatusBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to profile when "Profile" button is clicked', () => {
    // Open the menu
    const trigger = fixture.debugElement.query(By.css('img')).nativeElement;
    trigger.click();
    fixture.detectChanges();

    const profileButton = fixture.debugElement.query(
      By.css('button[mat-menu-item]:nth-child(1)'),
    ).nativeElement;
    profileButton.click();

    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('should call logout on the AuthenticationService when "Logout" button is clicked', () => {
    // Open the menu
    const trigger = fixture.debugElement.query(By.css('img')).nativeElement;
    trigger.click();
    fixture.detectChanges();

    const logoutButton = fixture.debugElement.query(
      By.css('button[mat-menu-item]:nth-child(2)'),
    ).nativeElement;
    logoutButton.click();

    expect(authenticationService.logout).toHaveBeenCalled();
  });
});
