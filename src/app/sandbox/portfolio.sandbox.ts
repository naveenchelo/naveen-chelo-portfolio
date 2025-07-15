import { inject, Injectable } from '@angular/core';
import { combineLatest, filter, map, Observable, of, timer } from 'rxjs';
import {
  EducationInterface,
  ExperienceInterface,
  PersonalInfoInterface,
  PortfolioInterface,
  ProjectInterface,
  SkillsInterface,
} from '../core/models/portfolio.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state/app.state';
import * as PortfolioSelectors from '../store/selectors/portfolio.selectors';
import * as PortfolioActions from '../store/actions/portfolio.actions';

@Injectable({ providedIn: 'root' })
export class PortfolioSandbox {
  private store = inject(Store<AppState>);

  // Main data selectors
  public get portfolioData$(): Observable<PortfolioInterface | null> {
    return this.store.select(PortfolioSelectors.selectPortfolioData);
  }

  public get isLoading$(): Observable<boolean> {
    return this.store.select(PortfolioSelectors.selectIsLoading);
  }

  public get error$(): Observable<string | null> {
    return this.store.select(PortfolioSelectors.selectError);
  }

  // Specific data selectors
  public get personalInfo$(): Observable<PersonalInfoInterface | undefined> {
    return this.store.select(PortfolioSelectors.selectPersonalInfo);
  }

  public get skills$(): Observable<SkillsInterface | undefined> {
    return this.store.select(PortfolioSelectors.selectSkills);
  }

  public get experience$(): Observable<ExperienceInterface[] | undefined> {
    return this.store.select(PortfolioSelectors.selectExperience);
  }

  public get projects$(): Observable<ProjectInterface[] | undefined> {
    return this.store.select(PortfolioSelectors.selectProjects);
  }

  public get featuredProjects$(): Observable<ProjectInterface[] | undefined> {
    return this.store.select(PortfolioSelectors.selectFeaturedProjects);
  }

  public get education$(): Observable<EducationInterface | undefined> {
    return this.store.select(PortfolioSelectors.selectEducation);
  }

  public get certifications$(): Observable<string[] | undefined> {
    return this.store.select(PortfolioSelectors.selectCertifications);
  }

  // Computed observables
  public get isDataLoaded$(): Observable<boolean> {
    return this.portfolioData$.pipe(map((data) => data !== null));
  }

  public get hasError$(): Observable<boolean> {
    return this.error$.pipe(map((error) => error !== null));
  }

  public get skillCategories$(): Observable<string[]> {
    return this.skills$.pipe(
      filter((skills) => !!skills),
      map((skills) => Object.keys(skills!))
    );
  }

  // Recalculate every time it's accessed with current date
  public readonly totalExperience$: Observable<string> = this.experience$.pipe(
    map((experience) => {
      if (!experience || experience.length === 0) return '0 years';

      const currentDate = new Date();

      const totalMonths = experience.reduce((acc, exp) => {
        const start = new Date(exp.startDate);
        const end = exp.endDate ? new Date(exp.endDate) : currentDate;

        // Calculate months between start and end dates
        const months =
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth()) +
          (end.getDate() >= start.getDate() ? 0 : -1);

        return acc + Math.max(0, months);
      }, 0);

      const years = Math.floor(totalMonths / 12);
      const remainderMonths = totalMonths % 12;

      if (years >= 3) {
        return '3+ years';
      }

      if (years === 0) {
        return remainderMonths === 0
          ? '0 months'
          : `${remainderMonths} month${remainderMonths > 1 ? 's' : ''}`;
      }

      return remainderMonths === 0
        ? `${years} year${years > 1 ? 's' : ''}`
        : `${years} year${years > 1 ? 's' : ''} ${remainderMonths} month${
            remainderMonths > 1 ? 's' : ''
          }`;
    })
  );

  //Experience calculation that updates every minute
  public readonly totalExperienceRealTime$: Observable<string> = combineLatest([
    this.experience$,
    timer(0, 60000), // Update every minute
  ]).pipe(
    map(([experience]) => {
      if (!experience || experience.length === 0) return '0 years';

      const currentDate = new Date();

      const totalMonths = experience.reduce((acc, exp) => {
        const start = new Date(exp.startDate);
        const end = exp.endDate ? new Date(exp.endDate) : currentDate;

        const months =
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth()) +
          (end.getDate() >= start.getDate() ? 0 : -1);

        return acc + Math.max(0, months);
      }, 0);

      const years = Math.floor(totalMonths / 12);
      const remainderMonths = totalMonths % 12;

      if (years >= 3) {
        return '3+ years';
      }

      if (years === 0) {
        return remainderMonths === 0
          ? '0 months'
          : `${remainderMonths} month${remainderMonths > 1 ? 's' : ''}`;
      }

      return remainderMonths === 0
        ? `${years} year${years > 1 ? 's' : ''}`
        : `${years} year${years > 1 ? 's' : ''} ${remainderMonths} month${
            remainderMonths > 1 ? 's' : ''
          }`;
    })
  );

  // Get current experience duration for specific position
  public getCurrentExperienceDuration$(): Observable<string> {
    return this.experience$.pipe(
      map((experience) => {
        if (!experience || experience.length === 0) return '0 months';

        const currentExp = experience[0];
        const start = new Date(currentExp.startDate);
        const end = currentExp.endDate
          ? new Date(currentExp.endDate)
          : new Date();

        const totalMonths =
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth()) +
          (end.getDate() >= start.getDate() ? 0 : -1);

        const years = Math.floor(totalMonths / 12);
        const remainderMonths = totalMonths % 12;

        if (years === 0) {
          return `${remainderMonths} month${remainderMonths > 1 ? 's' : ''}`;
        }

        return remainderMonths === 0
          ? `${years} year${years > 1 ? 's' : ''}`
          : `${years} year${years > 1 ? 's' : ''} ${remainderMonths} month${
              remainderMonths > 1 ? 's' : ''
            }`;
      })
    );
  }

  public get totalProjects$(): Observable<number> {
    return this.projects$.pipe(map((projects) => projects?.length || 0));
  }

  public loadPortfolioData(): void {
    this.store.dispatch(PortfolioActions.loadPortfolioData());
  }

  public resetPortfolioState(): void {
    this.store.dispatch(PortfolioActions.resetPortfolioState());
  }

  // Utility methods
  public getProjectById(id: number): Observable<ProjectInterface | undefined> {
    return this.projects$.pipe(
      map((projects) => projects?.find((project) => project.id === id))
    );
  }

  public getSkillsByCategory(category: string): Observable<string[]> {
    return this.skills$.pipe(
      map((skills) => {
        if (!skills) return [];
        return (skills as any)[category] || [];
      })
    );
  }

  public getCurrentClient(): Observable<string> {
    return this.experience$.pipe(
      map((experience) => {
        if (!experience || experience.length === 0) return '';
        const currentExp = experience[0];
        const currentClient = currentExp.clients[0];
        return currentClient?.name || '';
      })
    );
  }

  public getExperienceByCompany(
    company: string
  ): Observable<ExperienceInterface | undefined> {
    return this.experience$.pipe(
      map((experience) =>
        experience?.find((exp) =>
          exp.company.toLowerCase().includes(company.toLowerCase())
        )
      )
    );
  }
}
