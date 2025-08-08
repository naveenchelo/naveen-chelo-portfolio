import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PersonalInfoInterface } from '../../core/models/portfolio.interface';
import { PortfolioSandbox } from '../../sandbox/portfolio.sandbox';
import { interval, Observable, takeWhile } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  @ViewChild('particlesContainer', { static: false })
  particlesContainer!: ElementRef;

  personalInfo$: Observable<PersonalInfoInterface | undefined>;
  totalExperience$!: Observable<string>;

  // Typing animation texts
  typingTexts: string[] = [
    'Senior Angular Developer',
    'Frontend Developer',
    'TypeScript Expert',
    'UI/UX Enthusiast',
  ];

  // Counter animations
  animatedExperience: number = 0;
  animatedProjects: number = 0;
  targetExperience: number = 0;
  targetProjects: number = 0;

  // Loading states
  imageLoaded: boolean = false;
  isCounterAnimated: boolean = false;

  // Download functionality
  isDownloading = false;
  showDownloadSuccess = false;
  downloadDuration = 3000;

  private resumeUrl = 'resume/resume.pdf';
  private resumeFileName = 'Naveen_Chelo_Angular_Developer.pdf';
  private particleAnimationId: number = 0;

  constructor(private portfolioSandbox: PortfolioSandbox) {
    this.personalInfo$ = this.portfolioSandbox.myPersonalInfo$;
    this.totalExperience$ = this.portfolioSandbox.totalExperience$;
  }

  ngOnInit() {
    this.portfolioSandbox.loadPortfolioData();
    this.setupCounterAnimation();
  }

  ngAfterViewInit() {
    this.setupIntersectionObserver();
  }

  ngOnDestroy() {
    if (this.particleAnimationId) {
      cancelAnimationFrame(this.particleAnimationId);
    }
  }

  onImageLoad() {
    this.imageLoaded = true;
  }

  private setupCounterAnimation() {
    // Get target values
    this.portfolioSandbox.totalExperience$.subscribe((exp) => {
      const match = exp.match(/(\d+(?:\.\d+)?)/);
      this.targetExperience = match ? parseFloat(match[1]) : 0;
    });
    // No totalProjects$ in PortfolioSandbox; fallback to 0 or implement as needed
    this.targetProjects = 0;
  }

  private setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.isCounterAnimated) {
            this.animateCounters();
            this.isCounterAnimated = true;
          }
        });
      },
      { threshold: 0.5 }
    );

    const heroSection = document.querySelector('.hero-stats');
    if (heroSection) {
      observer.observe(heroSection);
    }
  }

  private animateCounters() {
    // Animate experience counter
    const experienceDuration = 2000;
    const experienceSteps = 60;
    const experienceIncrement = this.targetExperience / experienceSteps;

    interval(experienceDuration / experienceSteps)
      .pipe(takeWhile(() => this.animatedExperience < this.targetExperience))
      .subscribe(() => {
        this.animatedExperience = Math.min(
          this.animatedExperience + experienceIncrement,
          this.targetExperience
        );
        this.animatedExperience = parseFloat(
          this.animatedExperience.toFixed(1)
        );
      });

    // Animate projects counter
    const projectsDuration = 2500;
    const projectsSteps = 40;
    const projectsIncrement = this.targetProjects / projectsSteps;

    interval(projectsDuration / projectsSteps)
      .pipe(takeWhile(() => this.animatedProjects < this.targetProjects))
      .subscribe(() => {
        this.animatedProjects = Math.min(
          Math.floor(this.animatedProjects + projectsIncrement),
          this.targetProjects
        );
      });
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

    // Track download analytics
    this.trackResumeDownload();
  }

  private trackResumeDownload() {
    // Google Analytics 4 (gtag.js) event tracking
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'download_resume', {
        event_category: 'Resume',
        event_label: 'Hero Section Enhanced',
        value: 1,
      });
    } else {
      console.log('gtag not found: Resume download event not sent');
    }
  }
}
