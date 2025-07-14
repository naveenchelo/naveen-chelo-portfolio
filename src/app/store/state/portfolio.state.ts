import { PortfolioInterface } from '../../core/models/portfolio.interface';

export interface PortfolioState {
  data: PortfolioInterface | null;
  isLoading: boolean;
  error: string | null;
}
