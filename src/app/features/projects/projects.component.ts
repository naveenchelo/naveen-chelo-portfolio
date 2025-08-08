import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientInterface } from '../../core/models/portfolio.interface';
import { PortfolioSandbox } from '../../sandbox/portfolio.sandbox';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  clients$: Observable<ClientInterface[] | undefined>;
  filteredClients: ClientInterface[] = [];
  currentFilter = 'all';

  constructor(private portfolioSandbox: PortfolioSandbox) {
    this.clients$ = this.portfolioSandbox.clients$;
  }

  ngOnInit() {
    this.clients$.subscribe((clients) => {
      if (clients) {
        this.filteredClients = clients;
      }
    });
  }

  filterProjects(filter: string) {
    this.currentFilter = filter;

    this.clients$.subscribe((clients) => {
      if (!clients) return;

      switch (filter) {
        case 'featured':
          this.filteredClients = clients.filter((c) => c.featured);
          break;
        case 'production':
          this.filteredClients = clients.filter(
            (c) => c.status === 'Production'
          );
          break;
        default:
          this.filteredClients = clients;
      }
    });
  }
}
