import { Injectable } from '@angular/core';
import { filter, map, Observable, of } from 'rxjs';
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

  public totalExperience$: Observable<string> = (
    this.experience$ ?? of([])
  ).pipe(
    map((experience) => {
      if (!experience || experience.length === 0) return '0 years';
      const totalYears = experience.reduce((acc, exp) => {
        const startYear = new Date(exp.startDate).getFullYear();
        const endYear = exp.endDate
          ? new Date(exp.endDate).getFullYear()
          : new Date().getFullYear();
        return acc + (endYear - startYear);
      }, 0);
      return `${totalYears}+ year${totalYears > 1 ? 's' : ''}`;
    })
  );
}
