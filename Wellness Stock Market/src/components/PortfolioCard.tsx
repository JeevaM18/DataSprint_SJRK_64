import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Plus, Minus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface Stock {
  ticker: string;
  teamName: string;
  price: number;
  change: number;
  changePercent: number;
}

interface PortfolioCardProps {
  stocks: Stock[];
}

interface Holding {
  ticker: string;
  shares: number;
  avgPrice: number;
}

export const PortfolioCard = ({ stocks }: PortfolioCardProps) => {
  const [holdings, setHoldings] = useState<Holding[]>([
    { ticker: "ENG", shares: 25, avgPrice: 118.40 },
    { ticker: "SAL", shares: 15, avgPrice: 142.20 },
    { ticker: "FIN", shares: 30, avgPrice: 128.90 },
  ]);
  const [wellnessCoins, setWellnessCoins] = useState<number>(1250); // Wellness coins state
  const [portfolioValue, setPortfolioValue] = useState<number>(15847.32); // Portfolio value state

  const [tradeOpen, setTradeOpen] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");

  // 🧮 Helpers
  const calculateValue = (holding: Holding) => {
    const stock = stocks.find(s => s.ticker === holding.ticker);
    return stock ? holding.shares * stock.price : 0;
  };

  const calculateGainLoss = (holding: Holding) => {
    const stock = stocks.find(s => s.ticker === holding.ticker);
    if (!stock) return { gain: 0, percent: 0 };

    const currentValue = holding.shares * stock.price;
    const costBasis = holding.shares * holding.avgPrice;
    const gain = currentValue - costBasis;
    const percent = (gain / costBasis) * 100;

    return { gain, percent };
  };

  const handleTrade = () => {
    const stock = stocks.find(s => s.ticker === selectedTicker);
    if (!stock || quantity <= 0) return;

    const tradeAmount = stock.price * quantity;

    if (tradeType === "buy") {
      if (wellnessCoins < tradeAmount) return; // Not enough coins

      setWellnessCoins(prev => prev - tradeAmount); // Deduct coins by stock price * quantity
      setPortfolioValue(prev => prev - tradeAmount); // Reduce portfolio value by cost

      setHoldings(prev => {
        const existing = prev.find(h => h.ticker === stock.ticker);

        if (existing) {
          // update avg price
          const newShares = existing.shares + quantity;
          const newAvg =
            (existing.avgPrice * existing.shares + stock.price * quantity) / newShares;
          return prev.map(h =>
            h.ticker === stock.ticker
              ? { ...h, shares: newShares, avgPrice: newAvg }
              : h
          );
        } else {
          return [...prev, { ticker: stock.ticker, shares: quantity, avgPrice: stock.price }];
        }
      });
    } else if (tradeType === "sell") {
      setHoldings(prev => {
        const existing = prev.find(h => h.ticker === stock.ticker);
        if (!existing) return prev;
        const newShares = existing.shares - quantity;

        setPortfolioValue(prev => prev + tradeAmount); // Add to portfolio value
        setWellnessCoins(prev => prev + tradeAmount); // Add coins by stock price * quantity

        if (newShares <= 0) {
          return prev.filter(h => h.ticker !== stock.ticker);
        } else {
          return prev.map(h =>
            h.ticker === stock.ticker ? { ...h, shares: newShares } : h
          );
        }
      });
    }

    setTradeOpen(false);
    setQuantity(1);
    setSelectedTicker("");
  };


  return (
    <Card className="financial-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>My Portfolio</span>
          <Badge variant="outline" className="text-sm">
            {holdings.length} Holdings
          </Badge>
        </CardTitle>
        <div className="flex gap-4 mt-2">
          <Badge variant="secondary">Wellness Coins: {wellnessCoins}</Badge>
          <Badge variant="secondary">Portfolio Value: ${portfolioValue.toFixed(2)}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {holdings.map((holding) => {
            const stock = stocks.find(s => s.ticker === holding.ticker);
            const { gain, percent } = calculateGainLoss(holding);
            const currentValue = calculateValue(holding);

            if (!stock) return null;

            return (
              <div
                key={holding.ticker}
                className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-primary">{holding.ticker}</span>
                    <span className="text-sm text-muted-foreground">{stock.teamName}</span>
                    <Badge
                      variant={stock.change >= 0 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {stock.change >= 0 ? "+" : ""}
                      {stock.changePercent.toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Shares: </span>
                      <span className="font-medium">{holding.shares}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Avg Cost: </span>
                      <span className="font-medium">${holding.avgPrice.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Current: </span>
                      <span className="font-medium">${stock.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-lg">${currentValue.toFixed(2)}</div>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      gain >= 0 ? "price-up" : "price-down"
                    }`}
                  >
                    {gain >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {gain >= 0 ? "+" : "-"}${Math.abs(gain).toFixed(2)} (
                    {percent >= 0 ? "+" : ""}
                    {percent.toFixed(2)}%)
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-4 border-t">
            <Button
              className="w-full gradient-primary text-white hover:opacity-90 transition-opacity"
              onClick={() => setTradeOpen(true)}
            >
              Trade Shares
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Trade Modal */}
      <Dialog open={tradeOpen} onOpenChange={setTradeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trade Stocks</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Select onValueChange={setSelectedTicker}>
              <SelectTrigger>
                <SelectValue placeholder="Select Department Stock" />
              </SelectTrigger>
              <SelectContent>
                {stocks.map((s) => (
                  <SelectItem key={s.ticker} value={s.ticker}>
                    {s.teamName} ({s.ticker})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Quantity"
            />

            <div className="flex gap-2 items-center">
              <Button
                className={tradeType === "buy" ? "bg-green-600 text-white" : ""}
                onClick={() => setTradeType("buy")}
                disabled={wellnessCoins < quantity}
              >
                Buy
              </Button>
              {tradeType === "buy" && (
                <span className="ml-2 text-sm text-muted-foreground">
                  Cost: {quantity} Wellness Coins
                  {wellnessCoins < quantity && (
                    <span className="text-red-500 ml-2">Not enough coins</span>
                  )}
                </span>
              )}
              <Button
                className={tradeType === "sell" ? "bg-red-600 text-white" : ""}
                onClick={() => setTradeType("sell")}
              >
                Sell
              </Button>
              {tradeType === "sell" && selectedTicker && (
                <span className="ml-2 text-sm text-muted-foreground">
                  Receive: ${(
                    (stocks.find(s => s.ticker === selectedTicker)?.price ?? 0) * quantity
                  ).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleTrade}
              className="gradient-primary text-white"
              disabled={tradeType === "buy" && wellnessCoins < quantity}
            >
              Confirm Trade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
