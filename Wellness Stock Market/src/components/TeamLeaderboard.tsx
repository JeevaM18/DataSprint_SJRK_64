import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, TrendingDown, Users } from 'lucide-react';

interface Stock {
  ticker: string;
  teamName: string;
  price: number;
  change: number;
  changePercent: number;
}

interface TeamLeaderboardProps {
  teams: Stock[];
}

interface TeamPerformance extends Stock {
  marketCap: number;
  weeklyVolume: number;
  memberCount: number;
  wellnessScore: number;
}

export const TeamLeaderboard = ({ teams }: TeamLeaderboardProps) => {
  // Enhanced team data with additional metrics
  const enhancedTeams: TeamPerformance[] = teams.map((team, index) => ({
    ...team,
    marketCap: team.price * (50 + index * 10), // Mock market cap calculation
    weeklyVolume: Math.floor(Math.random() * 1000) + 500,
    memberCount: Math.floor(Math.random() * 20) + 8,
    wellnessScore: Math.floor(Math.random() * 40) + 60,
  })).sort((a, b) => b.marketCap - a.marketCap);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-4 w-4 text-warning" />;
    if (index === 1) return <Trophy className="h-4 w-4 text-muted-foreground" />;
    if (index === 2) return <Trophy className="h-4 w-4 text-orange-600" />;
    return <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>;
  };

  return (
    <Card className="financial-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-warning" />
          Team Rankings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {enhancedTeams.map((team, index) => (
            <div key={team.ticker} className={`p-3 rounded-lg border transition-colors hover:bg-muted/50 ${
              index === 0 ? 'bg-warning/10 border-warning/30' : 
              index === 1 ? 'bg-muted/20 border-muted' :
              index === 2 ? 'bg-orange-100 border-orange-300' : 
              'bg-card border-border'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {getRankIcon(index)}
                  <div>
                    <div className="font-semibold">${team.ticker}</div>
                    <div className="text-xs text-muted-foreground">{team.teamName}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${team.price.toFixed(2)}</div>
                  <div className={`flex items-center gap-1 text-xs ${team.change >= 0 ? 'price-up' : 'price-down'}`}>
                    {team.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {team.changePercent >= 0 ? '+' : ''}{team.changePercent.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{team.memberCount} members</span>
                </div>
                <div>
                  <span>Score: </span>
                  <Badge variant="outline" className={`text-xs ${
                    team.wellnessScore >= 85 ? 'text-success border-success' :
                    team.wellnessScore >= 70 ? 'text-warning border-warning' :
                    'text-muted-foreground border-muted'
                  }`}>
                    {team.wellnessScore}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <span>Market Cap: </span>
                  <span className="font-medium">${team.marketCap.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-accent/20 rounded-lg">
          <div className="text-sm font-medium text-accent-foreground mb-1">Weekly Highlights</div>
          <div className="text-xs text-muted-foreground">
            🏆 $SAL leads with highest gains<br/>
            📈 $ENG shows strong momentum<br/>
            💪 $FIN maintains steady growth
          </div>
        </div>
      </CardContent>
    </Card>
  );
};