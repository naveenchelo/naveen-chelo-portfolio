import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map, filter, timer } from 'rxjs';
import { AppState } from '../store/state/app.state';
import * as PortfolioActions from '../store/actions/portfolio.actions';
import * as PortfolioSelectors from '../store/selectors/portfolio.selectors';
import {
  PortfolioInterface,
  PersonalInfoInterface,
  SkillsInterface,
  ExperienceInterface,
  ProjectInterface,
  EducationInterface,
} from '../core/models/portfolio.interface';

@Injectable({
  providedIn: 'root',
})
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

  //PersonalInfo with dynamic summary
  public get enhancedPersonalInfo$(): Observable<
    PersonalInfoInterface | undefined
  > {
    return combineLatest([this.personalInfo$, this.totalExperience$]).pipe(
      map(([personalInfo, totalExperience]) => {
        if (!personalInfo) return personalInfo;

        const updatedSummary = personalInfo.summary.replace(
          /\d+(\.\d+)?\s*years?\s*of\s*experience/gi,
          `${totalExperience} of experience`
        );

        return {
          ...personalInfo,
          summary: updatedSummary,
        };
      })
    );
  }

  // PersonalInfo with real-time experience updates
  public get enhancedPersonalInfoRealTime$(): Observable<
    PersonalInfoInterface | undefined
  > {
    return combineLatest([
      this.personalInfo$,
      this.totalExperienceRealTime$,
    ]).pipe(
      map(([personalInfo, totalExperience]) => {
        if (!personalInfo) return personalInfo;

        const updatedSummary = personalInfo.summary.replace(
          /\d+(\.\d+)?\s*years?\s*of\s*experience/gi,
          `${totalExperience} of experience`
        );

        return {
          ...personalInfo,
          summary: updatedSummary,
        };
      })
    );
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

  // Experience calculation
  public readonly totalExperience$: Observable<string> = this.experience$.pipe(
    map((experience) => {
      if (!experience || experience.length === 0) return '0 years';

      const currentDate = new Date();

      const totalMonths = experience.reduce((acc, exp) => {
        // Parse duration string from JSON (e.g., "Mar 2022 – Present")
        const durationParts = exp.duration.split(' – ');
        const startDateStr = durationParts[0];
        const endDateStr = durationParts[1];

        // Parse start date
        const start = new Date(startDateStr + ' 1');

        // Parse end date
        let end: Date;
        if (endDateStr === 'Present') {
          end = currentDate;
        } else {
          end = new Date(endDateStr + ' 1');
        }

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
        // Show exact years with decimal for 3+ years
        const exactYears = (totalMonths / 12).toFixed(1);
        return `${exactYears} years`;
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
        // Parse duration string from JSON (e.g., "Mar 2022 – Present")
        const durationParts = exp.duration.split(' – ');
        const startDateStr = durationParts[0];
        const endDateStr = durationParts[1];

        // Parse start date
        const start = new Date(startDateStr + ' 1');

        // Parse end date
        let end: Date;
        if (endDateStr === 'Present') {
          end = currentDate;
        } else {
          end = new Date(endDateStr + ' 1');
        }

        const months =
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth()) +
          (end.getDate() >= start.getDate() ? 0 : -1);

        return acc + Math.max(0, months);
      }, 0);

      const years = Math.floor(totalMonths / 12);
      const remainderMonths = totalMonths % 12;

      if (years >= 3) {
        // Show exact years with decimal for 3+ years
        const exactYears = (totalMonths / 12).toFixed(1);
        return `${exactYears} years`;
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
        // Parse duration string from JSON (e.g., "Mar 2022 – Present")
        const durationParts = currentExp.duration.split(' – ');
        const startDateStr = durationParts[0];
        const endDateStr = durationParts[1];

        const start = new Date(startDateStr + ' 1');
        const end =
          endDateStr === 'Present' ? new Date() : new Date(endDateStr + ' 1');

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
