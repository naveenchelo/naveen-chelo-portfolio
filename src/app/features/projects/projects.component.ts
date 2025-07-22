import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectInterface } from '../../core/models/portfolio.interface';
import { PortfolioSandbox } from '../../sandbox/portfolio.sandbox';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.scss',
    standalone: false
})
export class ProjectsComponent implements OnInit {
  projects$: Observable<ProjectInterface[] | undefined>;
  filteredProjects: ProjectInterface[] = [];
  currentFilter = 'all';

  constructor(private portfolioSandbox: PortfolioSandbox) {
    this.projects$ = this.portfolioSandbox.projects$;
  }

  ngOnInit() {
    this.projects$.subscribe((projects) => {
      if (projects) {
        this.filteredProjects = projects;
      }
    });
  }

  filterProjects(filter: string) {
    this.currentFilter = filter;

    this.projects$.subscribe((projects) => {
      if (!projects) return;

      switch (filter) {
        case 'featured':
          this.filteredProjects = projects.filter((p) => p.featured);
          break;
        case 'production':
          this.filteredProjects = projects.filter(
            (p) => p.status === 'Production'
          );
          break;
        default:
          this.filteredProjects = projects;
      }
    });
  }
}
