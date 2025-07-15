import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SkillsInterface } from '../../core/models/portfolio.interface';
import { PortfolioSandbox } from '../../sandbox/portfolio.sandbox';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  skills$: Observable<SkillsInterface | undefined>;

  constructor(private portfolioSandbox: PortfolioSandbox) {
    this.skills$ = this.portfolioSandbox.skills$;
  }

  getSkillCategories(skills: SkillsInterface): (keyof SkillsInterface)[] {
    return Object.keys(skills) as (keyof SkillsInterface)[];
  }
}
