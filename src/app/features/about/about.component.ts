import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {
  EducationInterface,
  PersonalInfoInterface,
} from '../../core/models/portfolio.interface';
import { PortfolioSandbox } from '../../sandbox/portfolio.sandbox';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss',
    standalone: false
})
export class AboutComponent {
  personalInfo$!: Observable<PersonalInfoInterface | undefined>;
  education$!: Observable<EducationInterface | undefined>;
  totalExperience$!: Observable<string>;
  totalProjects$!: Observable<number>;
  currentClient$!: Observable<string>;

  constructor(private portfolioSandbox: PortfolioSandbox) {
    this.personalInfo$ = this.portfolioSandbox.myPersonalInfo$;
    this.education$ = this.portfolioSandbox.education$;
    this.totalExperience$ = this.portfolioSandbox.totalExperience$;
    this.totalProjects$ = this.portfolioSandbox.totalProjects$;
    this.currentClient$ = this.portfolioSandbox.getCurrentClient();
  }
}
