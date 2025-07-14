import { createAction, props } from '@ngrx/store';
import { PortfolioInterface } from '../../core/models/portfolio.interface';

export const loadPortfolioData = createAction(
  '[Portfolio] Load Portfolio Data'
);

export const loadPortfolioDataSuccess = createAction(
  '[Portfolio] Load Portfolio Data Success',
  props<{ data: PortfolioInterface }>()
);
export const loadPortfolioDataFailure = createAction(
  '[Portfolio] Load Portfolio Data Failure',
  props<{ error: any }>()
);
