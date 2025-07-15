import { ActionReducerMap } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { portfolioReducer } from './portfolio.reducers';

export const appReducers: ActionReducerMap<AppState> = {
  portfolio: portfolioReducer,
};
