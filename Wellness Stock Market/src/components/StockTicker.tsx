import { TrendingUp, TrendingDown } from 'lucide-react';

interface Stock {
  ticker: string;
  teamName: string;
  price: number;
  change: number;
  changePercent: number;
}

interface StockTickerProps {
  stocks: Stock[];
}

export const StockTicker = ({ stocks }: StockTickerProps) => {
  return (
    <div className="market-ticker py-3 overflow-hidden">
      <div className="animate-ticker-scroll flex gap-8 whitespace-nowrap">
        {[...stocks, ...stocks, ...stocks].map((stock, index) => (
          <div key={`${stock.ticker}-${index}`} className="flex items-center gap-2 text-sm font-medium">
            <span className="text-primary font-bold">${stock.ticker}</span>
            <span className="text-foreground">${stock.price.toFixed(2)}</span>
            <span className={`flex items-center gap-1 ${stock.change >= 0 ? 'price-up' : 'price-down'}`}>
              {stock.change >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};