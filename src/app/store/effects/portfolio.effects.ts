import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PortfolioService } from '../../core/services/portfolio.service';
import * as PortfolioActions from '../actions/portfolio.actions';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class PortfolioEffects {
  constructor(
    private actions$: Actions,
    private portfolioService: PortfolioService
  ) {}

  loadPortfolioData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PortfolioActions.loadPortfolioData),
      switchMap(() =>
        this.portfolioService.getPortfolioData().pipe(
          map((data) => PortfolioActions.loadPortfolioDataSuccess({ data })),
          catchError((error) =>
            of(
              PortfolioActions.loadPortfolioDataFailure({
                error: error.message || 'Failed to load portfolio data',
              })
            )
          )
        )
      )
    )
  );
}
