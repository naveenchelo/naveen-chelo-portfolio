import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PortfolioState } from '../state/portfolio.state';

export const selectPortfolioState =
  createFeatureSelector<PortfolioState>('portfolio');

export const selectPortfolioData = createSelector(
  selectPortfolioState,
  (state: PortfolioState) => state.data
);

export const selectIsLoading = createSelector(
  selectPortfolioState,
  (state: PortfolioState) => state.isLoading
);

export const selectError = createSelector(
  selectPortfolioState,
  (state: PortfolioState) => state.error
);

export const selectPersonalInfo = createSelector(
  selectPortfolioData,
  (data) => data?.personalInfo
);

export const selectSkills = createSelector(
  selectPortfolioData,
  (data) => data?.skills
);

export const selectExperience = createSelector(
  selectPortfolioData,
  (data) => data?.experience
);

export const selectProjects = createSelector(
  selectPortfolioData,
  (data: any) => data?.projects
);

export const selectFeaturedProjects = createSelector(
  selectProjects,
  (projects: any[] | undefined) =>
    projects?.filter((project: any) => project.featured)
);

export const selectEducation = createSelector(
  selectPortfolioData,
  (data) => data?.education
);

export const selectCertifications = createSelector(
  selectPortfolioData,
  (data) => data?.certifications
);
