import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { PortfolioInterface } from '../models/portfolio.interface';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private readonly DATA_URL = 'data/portfolio.json';

  constructor(private http: HttpClient) {}

  getPortfolioData(): Observable<PortfolioInterface> {
    return this.http.get<PortfolioInterface>(this.DATA_URL).pipe(
      map((data: PortfolioInterface) => this.processPortfolioData(data)),
      catchError((error) => {
        console.error('Error loading portfolio data:', error);
        throw error;
      })
    );
  }

  private processPortfolioData(data: PortfolioInterface): PortfolioInterface {
    // Add any data processing logic here
    return {
      ...data,
      projects: data.projects.map((project) => ({
        ...project,
        image: project.image || 'images/default-project.jpg',
      })),
    };
  }
}
