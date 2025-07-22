import { Component } from '@angular/core';
import { ExperienceInterface } from '../../core/models/portfolio.interface';
import { Observable } from 'rxjs';
import { PortfolioSandbox } from '../../sandbox/portfolio.sandbox';

@Component({
    selector: 'app-experience',
    templateUrl: './experience.component.html',
    styleUrl: './experience.component.scss',
    standalone: false
})
export class ExperienceComponent {
  experience$: Observable<ExperienceInterface[] | undefined>;

  constructor(private portfolioSandbox: PortfolioSandbox) {
    this.experience$ = this.portfolioSandbox.experience$;
  }
}
