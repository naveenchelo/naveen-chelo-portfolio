import { createReducer, on } from '@ngrx/store';
import { PortfolioState } from '../state/portfolio.state';

import * as PortfolioActions from '../actions/portfolio.actions';

export const initialState: PortfolioState = {
  data: null,
  isLoading: false,
  error: null,
};

export const portfolioReducer = createReducer(
  initialState,
  on(PortfolioActions.loadPortfolioData, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(PortfolioActions.loadPortfolioDataSuccess, (state, { data }) => ({
    ...state,
    data,
    isLoading: false,
    error: null,
  })),
  on(PortfolioActions.loadPortfolioDataFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(PortfolioActions.resetPortfolioState, () => initialState)
);
