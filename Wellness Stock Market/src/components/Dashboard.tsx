import { useState } from 'react';
import { Award, Users, Coins, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StockTicker } from './StockTicker';
import { PortfolioCard } from './PortfolioCard';
import { TeamLeaderboard } from './TeamLeaderboard';
import { WellnessChart } from './WellnessChart';
import { StockPriceChart } from './StockPriceChart';
import heroImage from '@/assets/hero-wellness-market.jpg';
import employeeData from '@/data/employee_wellness.json';

interface TeamStock {
  ticker: string;
  teamName: string;
  price: number;
  change: number;
  changePercent: number;
  nameColor?: string;
  priceColor?: string;
}

const colorPalette = [
  'hsl(var(--primary))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--destructive))',
];

// 1️⃣ Aggregate per team
const aggregatedStocks: TeamStock[] = Object.values(
  employeeData.reduce((acc: any, emp: any, index: number) => {
    const team = emp.Team_Name || 'Unknown';
    const wellnessScore = Math.floor((emp.Step_Count / 100) + (emp.HRV || 50) / 10);

    if (!acc[team]) {
      acc[team] = {
        teamName: team,
        ticker: team.slice(0, 3).toUpperCase(),
        totalScore: 0,
        count: 0,
        color: colorPalette[index % colorPalette.length],
      };
    }
    acc[team].totalScore += wellnessScore;
    acc[team].count += 1;
    return acc;
  }, {})
).map((t: any, index: number) => ({
  ticker: t.ticker,
  teamName: t.teamName,
  price: Math.round(t.totalScore / t.count),
  change: +(Math.random() * 10 - 5).toFixed(2),
  changePercent: +(((Math.random() * 10 - 5) / (t.totalScore / t.count)) * 100).toFixed(2),
  nameColor: colorPalette[index % colorPalette.length],
  priceColor: colorPalette[(index + 2) % colorPalette.length],
}));

// 2️⃣ Split into groups: 6, 6, 5
const groupedTeams = [
  aggregatedStocks.slice(0, 6),
  aggregatedStocks.slice(6, 12),
  aggregatedStocks.slice(12, 17),
];

export const Dashboard = () => {
  const [portfolio] = useState({
    totalValue: 15847.32,
    wellnessCoins: 1250,
    todayChange: 234.56,
    todayChangePercent: 1.5,
  });

  const [currentChallenge] = useState({
    title: 'Team Step Challenge',
    description: 'First team to 50K collective steps wins!',
    reward: '100 WC Bonus',
    timeLeft: '4h 23m',
  });

  const [page, setPage] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Hero Section */}
      <div
        className="relative h-64 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
        <div className="relative container mx-auto px-6 h-full flex items-center">
          <div className="text-white drop-shadow-lg">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 pixelated">🎮 Wellness Stock Market</h1>
            <p className="text-xl md:text-2xl opacity-90">Where your health becomes your wealth 💰</p>
          </div>
        </div>
      </div>

      {/* Stock Ticker Strip */}
      <div className="bg-white border-y-4 border-black py-2 shadow-lg">
        <StockTicker
          stocks={groupedTeams[page].map((s) => ({
            ...s,
            display: (
              <span className="flex gap-2 items-center">
                <span style={{ color: s.nameColor, fontWeight: 600 }}>{s.ticker}</span>
                <span style={{ color: s.priceColor }}>${s.price.toFixed(2)}</span>
              </span>
            ),
          }))}
        />
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* All 4 cards with same bg color */}
          <Card className="financial-card retro-card bg-gray-900 text-white border border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Value</CardTitle>
              <BarChart3 className="h-4 w-4 text-primary animate-bounce" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${portfolio.totalValue.toLocaleString()}</div>
              <p className={`text-sm ${portfolio.todayChange >= 0 ? 'price-up' : 'price-down'}`}>
                {portfolio.todayChange >= 0 ? '+' : ''}${portfolio.todayChange.toLocaleString()}
                ({portfolio.todayChangePercent >= 0 ? '+' : ''}{portfolio.todayChangePercent}%) today
              </p>
            </CardContent>
          </Card>

          <Card className="financial-card retro-card bg-gray-900 text-white border border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Wellness Coins</CardTitle>
              <Coins className="h-4 w-4 animate-spin text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{portfolio.wellnessCoins.toLocaleString()} 🪙</div>
              <p className="text-sm opacity-80">Ready to trade</p>
            </CardContent>
          </Card>

          <Card className="financial-card retro-card bg-gray-900 text-white border border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Challenge</CardTitle>
              <Award className="h-4 w-4 text-pink-500 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">{currentChallenge.title} 🏆</div>
              <p className="text-sm text-muted-foreground">{currentChallenge.timeLeft} left</p>
            </CardContent>
          </Card>

          <Card className="financial-card retro-card bg-gray-900 text-white border border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Teams</CardTitle>
              <Users className="h-4 w-4 text-green-400 animate-bounce" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{aggregatedStocks.length} 👥</div>
              <p className="text-sm text-success">All trading active</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart Navigation Buttons */}
        <div className="flex justify-end gap-2 mb-4">
          <Button onClick={() => setPage(0)} variant={page === 0 ? 'default' : 'outline'}>Teams 1–6</Button>
          <Button onClick={() => setPage(1)} variant={page === 1 ? 'default' : 'outline'}>Teams 7–12</Button>
          <Button onClick={() => setPage(2)} variant={page === 2 ? 'default' : 'outline'}>Teams 13–17</Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <PortfolioCard stocks={groupedTeams[page]} />
            <StockPriceChart stocks={groupedTeams[page]} />
            <WellnessChart />
          </div>
          <div>
            <TeamLeaderboard teams={groupedTeams[page]} />
          </div>
        </div>
      </div>
    </div>
  );
};
