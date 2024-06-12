import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { teamList } from './team-members-data';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  template: `
    <div class="about-us-container">
      <div class="team-container">
        @for (member of teamMembersList; track $index) {
          <mat-card class="team-card">
            <mat-card-header>
              <mat-card-title>{{ member.name }}</mat-card-title>
              <mat-card-subtitle>{{ member.title }}</mat-card-subtitle>
            </mat-card-header>
            <div class="profile-awatar">
              <img mat-card-image [src]="member.photo" alt="avatar" />
            </div>
            <mat-card-content>
              <p class="profile-short-bio-text">{{ member.shortBio }}</p>
            </mat-card-content>
            <mat-card-actions>
              <a mat-button href="{{ member.github }}" target="_blank"
                ><img
                  src="assets/github-mark.svg"
                  alt="github logotip"
                  style="height: 20px;"
                />
                {{ member.githubName }}</a
              >
            </mat-card-actions>
          </mat-card>
        }
      </div>

      <div class="rs-link-container">
        This project created as part of studying at
        <a href="https://rs.school/" ariaCurrentWhenActive="page">
          <img
            class="logo"
            src="assets/logo.svg"
            alt="logo of RSschool"
            style="height: 32px;"
          />
          School
        </a>
        .
      </div>
    </div>
  `,
  styles: `
    .about-us-container {
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .team-container {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .team-card {
      max-width: 345px;
    }
    .profile-short-bio-text {
      width: 300px;
      height: 42px;
      margin-inline: auto;
      text-align: center;
    }

    .profile-awatar {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #efc81e;
      margin: 10px auto 20px;

      img {
        width: 100%;
        height: auto;
        object-fit: cover;
        display: block;
      }
    }

    .rs-link-container {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: large;

      a {
        display: flex;
        align-items: center;
        gap: 2px;
        color: black;
        cursor: pointer;
        font-size: larger;
      }
    }
  `,
})
export class AboutUsComponent {
  teamMembersList = teamList;
}
