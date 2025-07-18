import { Component, OnInit } from '@angular/core';
import { PersonalInfoInterface } from '../../core/models/portfolio.interface';
import { PortfolioSandbox } from '../../sandbox/portfolio.sandbox';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  personalInfo$: Observable<PersonalInfoInterface | undefined>;
  totalExperience$!: Observable<string>;

  isDownloading = false;
  showDownloadSuccess = false;
  downloadDuration = 3000;

  private resumeUrl = 'resume/resume.pdf';
  private resumeFileName = 'Naveen_Chelo_Angular_Developer.pdf';

  constructor(private portfolioSandbox: PortfolioSandbox) {
    this.personalInfo$ = this.portfolioSandbox.myPersonalInfo$;
    this.totalExperience$ = this.portfolioSandbox.totalExperience$;
  }

  ngOnInit() {
    this.portfolioSandbox.loadPortfolioData();
  }

  scrollToProjects() {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToAbout() {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  }

  downloadResume() {
    if (this.isDownloading) return;

    this.isDownloading = true;

    // Create download link
    const link = document.createElement('a');
    link.href = this.resumeUrl;
    link.download = this.resumeFileName;

    // Simulate download with animation
    setTimeout(() => {
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.isDownloading = false;
      this.showDownloadSuccess = true;

      // Hide success message after 3 seconds
      setTimeout(() => {
        this.showDownloadSuccess = false;
      }, 3000);
    }, this.downloadDuration);

    // Track download analytics (optional)
    this.trackResumeDownload();
  }

  private trackResumeDownload() {
    // Google Analytics 4 (gtag.js) event tracking
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'download_resume', {
        event_category: 'Resume',
        event_label: 'Hero Section',
        value: 1,
      });
    } else {
      console.log('gtag not found: Resume download event not sent');
    }
  }
}
