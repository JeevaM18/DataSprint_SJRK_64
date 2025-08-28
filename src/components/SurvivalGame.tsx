import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Flame, Home, Droplets, Apple, Cloud, Compass } from 'lucide-react';
import jungleBackground from '@/assets/jungle-background.png';
import camperAvatar from '@/assets/camper-avatar.png';
import { FoodCourt } from './FoodCourt';
import { Leaderboard } from './Leaderboard';

interface WellnessMetrics {
  steps: number;
  sleep: number;
  meditation: number;
  nutrition: number;
  absenteeism: number;
  collaboration: number;
}

export function SurvivalGame() {
  const [metrics, setMetrics] = useState<WellnessMetrics>({
    steps: 6500,
    sleep: 7.5,
    meditation: 15,
    nutrition: 75,
    absenteeism: 2,
    collaboration: 8
  });

  const [activeView, setActiveView] = useState<'game' | 'foodcourt' | 'leaderboard'>('game');
  const [avatarX, setAvatarX] = useState(50);

  // Animate avatar position
  useEffect(() => {
    const interval = setInterval(() => {
      setAvatarX(prev => (prev + 0.5) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getResourceLevel = (value: number, max: number) => (value / max) * 100;

  const firewoodLevel = getResourceLevel(metrics.steps, 10000);
  const shelterLevel = getResourceLevel(metrics.sleep, 9);
  const waterLevel = getResourceLevel(metrics.meditation, 30);
  const foodLevel = getResourceLevel(metrics.nutrition, 100);
  const stormLevel = Math.max(0, metrics.absenteeism * 20);
  const explorationLevel = getResourceLevel(metrics.collaboration, 10);

  return (
    <div 
      className="min-h-screen bg-jungle-dark relative overflow-hidden"
      style={{
        backgroundImage: `url(${jungleBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Atmospheric overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-jungle-dark/80 via-jungle-medium/50 to-jungle-dark/90 pointer-events-none" />
      
      {/* Navigation */}
      <nav className="relative z-10 p-4 flex justify-between items-center bg-jungle-medium/80 backdrop-blur-sm border-b border-jungle-light">
        <div className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-fire-glow animate-pulse" />
          <span className="text-xl font-bold text-moonlight">Jungle Survival</span>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={activeView === 'game' ? 'default' : 'secondary'}
            onClick={() => setActiveView('game')}
            className="bg-jungle-light border-jungle-medium hover:bg-jungle-medium text-moonlight"
          >
            Camp
          </Button>
          <Button 
            variant={activeView === 'foodcourt' ? 'default' : 'secondary'}
            onClick={() => setActiveView('foodcourt')}
            className="bg-jungle-light border-jungle-medium hover:bg-jungle-medium text-moonlight"
          >
            Food Court
          </Button>
          <Button 
            variant={activeView === 'leaderboard' ? 'default' : 'secondary'}
            onClick={() => setActiveView('leaderboard')}
            className="bg-jungle-light border-jungle-medium hover:bg-jungle-medium text-moonlight"
          >
            Leaderboard
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 p-6">
        {activeView === 'game' && (
          <div className="space-y-6">
            {/* Avatar */}
            <div className="relative h-32 mb-8">
              <div 
                className="absolute transition-all duration-100 ease-linear"
                style={{ left: `${avatarX}%` }}
              >
                <img 
                  src={camperAvatar} 
                  alt="Survival Camper"
                  className="w-16 h-16 pixelated animate-bounce"
                  style={{ imageRendering: 'pixelated' }}
                />
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-jungle-dark/50 rounded-full blur-sm" />
              </div>
            </div>

            {/* Survival Resources */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Firewood (Steps) */}
              <Card className="bg-jungle-medium/90 border-jungle-light p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <Flame className="h-8 w-8 text-fire-glow" />
                    <div className="absolute inset-0 animate-pulse bg-fire-glow/20 rounded-full blur-md" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-moonlight">Firewood</h3>
                    <p className="text-sm text-moonlight/70">Daily Steps: {metrics.steps.toLocaleString()}</p>
                  </div>
                </div>
                <Progress 
                  value={firewoodLevel} 
                  className="h-3 bg-jungle-dark"
                />
                <div className="flex justify-between text-xs text-moonlight/60 mt-1">
                  <span>0</span>
                  <span>10,000 steps</span>
                </div>
              </Card>

              {/* Shelter (Sleep) */}
              <Card className="bg-jungle-medium/90 border-jungle-light p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Home className="h-8 w-8 text-water-glow" />
                  <div>
                    <h3 className="text-lg font-bold text-moonlight">Shelter</h3>
                    <p className="text-sm text-moonlight/70">Sleep: {metrics.sleep}h</p>
                  </div>
                </div>
                <Progress 
                  value={shelterLevel} 
                  className="h-3 bg-jungle-dark"
                />
                <div className="flex justify-between text-xs text-moonlight/60 mt-1">
                  <span>0h</span>
                  <span>9h</span>
                </div>
              </Card>

              {/* Water (Meditation) */}
              <Card className="bg-jungle-medium/90 border-jungle-light p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Droplets className="h-8 w-8 text-water-glow animate-pulse" />
                  <div>
                    <h3 className="text-lg font-bold text-moonlight">Water</h3>
                    <p className="text-sm text-moonlight/70">Meditation: {metrics.meditation}min</p>
                  </div>
                </div>
                <Progress 
                  value={waterLevel} 
                  className="h-3 bg-jungle-dark"
                />
                <div className="flex justify-between text-xs text-moonlight/60 mt-1">
                  <span>0min</span>
                  <span>30min</span>
                </div>
              </Card>

              {/* Food (Nutrition) */}
              <Card className="bg-jungle-medium/90 border-jungle-light p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Apple className="h-8 w-8 text-accent animate-pulse" />
                  <div>
                    <h3 className="text-lg font-bold text-moonlight">Food</h3>
                    <p className="text-sm text-moonlight/70">Nutrition: {metrics.nutrition}%</p>
                  </div>
                </div>
                <Progress 
                  value={foodLevel} 
                  className="h-3 bg-jungle-dark"
                />
                <div className="flex justify-between text-xs text-moonlight/60 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </Card>

              {/* Storm (Absenteeism) */}
              <Card className="bg-jungle-medium/90 border-jungle-light p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Cloud className="h-8 w-8 text-storm" />
                  <div>
                    <h3 className="text-lg font-bold text-moonlight">Storm</h3>
                    <p className="text-sm text-moonlight/70">Absent Days: {metrics.absenteeism}</p>
                  </div>
                </div>
                <Progress 
                  value={stormLevel} 
                  className="h-3 bg-jungle-dark"
                />
                {stormLevel > 60 && (
                  <Badge variant="destructive" className="mt-2 bg-storm text-foreground">
                    Storm Warning!
                  </Badge>
                )}
              </Card>

              {/* Exploration (Collaboration) */}
              <Card className="bg-jungle-medium/90 border-jungle-light p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Compass className="h-8 w-8 text-accent animate-pulse" />
                  <div>
                    <h3 className="text-lg font-bold text-moonlight">Exploration</h3>
                    <p className="text-sm text-moonlight/70">Collaboration: {metrics.collaboration}/10</p>
                  </div>
                </div>
                <Progress 
                  value={explorationLevel} 
                  className="h-3 bg-jungle-dark"
                />
                <div className="flex justify-between text-xs text-moonlight/60 mt-1">
                  <span>0</span>
                  <span>10</span>
                </div>
              </Card>
            </div>

            {/* Survival Score */}
            <Card className="bg-jungle-medium/90 border-jungle-light p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-moonlight mb-4 flex items-center gap-2">
                <Flame className="h-6 w-6 text-fire-glow" />
                Survival Score
              </h3>
              <div className="text-3xl font-bold text-accent">
                {Math.round((firewoodLevel + shelterLevel + waterLevel + foodLevel + explorationLevel - stormLevel) / 5)}%
              </div>
              <p className="text-moonlight/70 mt-2">Your overall survival rating on the mysterious island</p>
            </Card>
          </div>
        )}

        {activeView === 'foodcourt' && <FoodCourt />}
        {activeView === 'leaderboard' && <Leaderboard />}
      </div>
    </div>
  );
}