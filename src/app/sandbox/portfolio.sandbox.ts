import { Injectable } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
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

@Injectable({
  providedIn: 'root',
})
export class PortfolioSandbox {
  constructor(private store: Store<AppState>) {}

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

  public get totalProjects$(): Observable<number> {
    return this.projects$.pipe(map((projects) => projects?.length || 0));
  }

  public get totalExperience$(): Observable<string> {
    return this.experience$.pipe(
      map((experience) => {
        if (!experience || experience.length === 0) return '0 years';

        const totalMonths = experience.reduce((acc, exp) => {
          const start = new Date(exp.startDate);
          const end = exp.endDate ? new Date(exp.endDate) : new Date();
          const months =
            (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth());
          return acc + months;
        }, 0);

        const years = Math.floor(totalMonths / 12);
        const remainderMonths = totalMonths % 12;

        if (years >= 3) {
          return '3+ years'; // based on resume
        }

        return remainderMonths === 0
          ? `${years} year${years > 1 ? 's' : ''}`
          : `${years} year${years > 1 ? 's' : ''} ${remainderMonths} month${
              remainderMonths > 1 ? 's' : ''
            }`;
      })
    );
  }
}
