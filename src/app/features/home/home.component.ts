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
    const resumeUrl = 'resume/Naveen_Chelo_Angular_Developer.pdf';
    const fileName = 'Naveen_Chelo_Angular_Developer.pdf';

    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = fileName;
    link.target = '_blank';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
