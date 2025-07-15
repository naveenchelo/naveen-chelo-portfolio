import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as PortfolioActions from '../actions/portfolio.actions';
import { PortfolioService } from '../../core/services/portfolio.service';

@Injectable()
export class PortfolioEffects {
  private actions$ = inject(Actions);
  private portfolioService = inject(PortfolioService);

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
