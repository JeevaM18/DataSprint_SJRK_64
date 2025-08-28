import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Crown, Shield, Zap } from 'lucide-react';
import employeeData from '@/data/employeeData.json';

interface Employee {
  Name: string;
  Dietary_Preference: string;
  Allergies: string;
  Health_Goals: string;
  Daily_Calories_Required: number;
  Step_Count: number;
  Role: string;
}

export function Leaderboard() {
  // Calculate survival scores for each employee
  const employeesWithScores = employeeData.map((employee: Employee) => {
    const lunchScore = 10; // Fixed as per original script
    const sleepHours = 5 + Math.random() * 4; // Random between 5-9 hours
    const sleepScore = Math.max(0, Math.min(10, ((sleepHours - 5) / 4) * 10));
    const stepsScore = Math.max(0, Math.min(10, (employee.Step_Count / 10000) * 10));
    const totalScore = lunchScore + sleepScore + stepsScore;

    return {
      ...employee,
      sleepHours: Math.round(sleepHours * 10) / 10,
      sleepScore: Math.round(sleepScore * 10) / 10,
      stepsScore: Math.round(stepsScore * 10) / 10,
      lunchScore,
      totalScore: Math.round(totalScore * 10) / 10
    };
  });

  // Sort by total score
  const sortedEmployees = [...employeesWithScores].sort((a, b) => b.totalScore - a.totalScore);

  // Group by role for team leaderboard
  const roleGroups = employeesWithScores.reduce((acc, employee) => {
    if (!acc[employee.Role]) {
      acc[employee.Role] = [];
    }
    acc[employee.Role].push(employee);
    return acc;
  }, {} as Record<string, typeof employeesWithScores>);

  const teamLeaderboard = Object.entries(roleGroups).map(([role, employees]) => {
    const top5 = employees.sort((a, b) => b.totalScore - a.totalScore).slice(0, 5);
    const avgSleep = top5.reduce((sum, emp) => sum + emp.sleepScore, 0) / top5.length;
    const avgSteps = top5.reduce((sum, emp) => sum + emp.stepsScore, 0) / top5.length;
    const avgLunch = top5.reduce((sum, emp) => sum + emp.lunchScore, 0) / top5.length;
    const totalScore = avgSleep + avgSteps + avgLunch;

    return {
      role,
      totalScore: Math.round(totalScore * 10) / 10,
      avgSleep: Math.round(avgSleep * 10) / 10,
      avgSteps: Math.round(avgSteps * 10) / 10,
      avgLunch: Math.round(avgLunch * 10) / 10,
      memberCount: employees.length
    };
  }).sort((a, b) => b.totalScore - a.totalScore);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="h-5 w-5 text-accent" />;
      case 1: return <Trophy className="h-5 w-5 text-moonlight" />;
      case 2: return <Shield className="h-5 w-5 text-fire-glow" />;
      default: return <Zap className="h-4 w-4 text-moonlight/60" />;
    }
  };

  const getBadgeForScore = (score: number) => {
    if (score >= 25) return { text: "Nocturnal Master", color: "bg-accent text-jungle-dark" };
    if (score >= 20) return { text: "Shadow Explorer", color: "bg-water-glow text-jungle-dark" };
    if (score >= 15) return { text: "Storm Survivor", color: "bg-fire-glow text-foreground" };
    return { text: "Island Dweller", color: "bg-jungle-light text-moonlight" };
  };

  return (
    <div className="space-y-6">
      {/* Individual Leaderboard */}
      <Card className="bg-jungle-medium/90 border-jungle-light p-6 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-moonlight mb-6 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-accent" />
          Survival Champions
        </h2>

        <div className="space-y-4">
          {sortedEmployees.map((employee, index) => {
            const badge = getBadgeForScore(employee.totalScore);
            
            return (
              <div key={employee.Name} className="flex items-center gap-4 p-4 bg-jungle-dark/50 rounded border border-jungle-light">
                <div className="flex items-center gap-2 min-w-[60px]">
                  {getRankIcon(index)}
                  <span className="text-lg font-bold text-moonlight">#{index + 1}</span>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-moonlight">{employee.Name}</h3>
                    <Badge variant="outline" className="border-jungle-light text-moonlight/70 text-xs">
                      {employee.Role}
                    </Badge>
                    <Badge className={badge.color + " text-xs"}>
                      {badge.text}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
                    <div className="text-moonlight/70">
                      Steps: {employee.Step_Count.toLocaleString()} 
                      <span className="text-accent ml-1">({employee.stepsScore}/10)</span>
                    </div>
                    <div className="text-moonlight/70">
                      Sleep: {employee.sleepHours}h 
                      <span className="text-water-glow ml-1">({employee.sleepScore}/10)</span>
                    </div>
                    <div className="text-moonlight/70">
                      Nutrition: 
                      <span className="text-fire-glow ml-1">({employee.lunchScore}/10)</span>
                    </div>
                    <div className="text-moonlight/70">
                      Goal: <span className="text-accent">{employee.Health_Goals}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-accent">
                    {employee.totalScore}
                  </div>
                  <div className="text-xs text-moonlight/60">
                    survival score
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Team Leaderboard */}
      <Card className="bg-jungle-medium/90 border-jungle-light p-6 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-moonlight mb-6 flex items-center gap-2">
          <Shield className="h-6 w-6 text-water-glow" />
          Longest Surviving Teams
        </h2>

        <div className="space-y-4">
          {teamLeaderboard.map((team, index) => (
            <div key={team.role} className="flex items-center gap-4 p-4 bg-jungle-dark/50 rounded border border-jungle-light">
              <div className="flex items-center gap-2 min-w-[60px]">
                {getRankIcon(index)}
                <span className="text-lg font-bold text-moonlight">#{index + 1}</span>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-moonlight">{team.role} Team</h3>
                  <Badge variant="outline" className="border-jungle-light text-moonlight/70 text-xs">
                    {team.memberCount} survivors
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-moonlight/60 mb-1">Avg Sleep Score</div>
                    <Progress value={team.avgSleep * 10} className="h-2 bg-jungle-dark" />
                    <div className="text-xs text-water-glow mt-1">{team.avgSleep}/10</div>
                  </div>
                  <div>
                    <div className="text-xs text-moonlight/60 mb-1">Avg Steps Score</div>
                    <Progress value={team.avgSteps * 10} className="h-2 bg-jungle-dark" />
                    <div className="text-xs text-accent mt-1">{team.avgSteps}/10</div>
                  </div>
                  <div>
                    <div className="text-xs text-moonlight/60 mb-1">Avg Nutrition Score</div>
                    <Progress value={team.avgLunch * 10} className="h-2 bg-jungle-dark" />
                    <div className="text-xs text-fire-glow mt-1">{team.avgLunch}/10</div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-accent">
                  {team.totalScore}
                </div>
                <div className="text-xs text-moonlight/60">
                  team score
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Badges & Achievements */}
      <Card className="bg-jungle-medium/90 border-jungle-light p-6 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-moonlight mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-fire-glow" />
          Mystical Badges
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-jungle-dark/50 rounded border border-jungle-light">
            <Crown className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-sm font-bold text-moonlight">Nocturnal Chef</div>
            <div className="text-xs text-moonlight/60">Perfect nutrition</div>
          </div>
          
          <div className="text-center p-3 bg-jungle-dark/50 rounded border border-jungle-light">
            <Shield className="h-8 w-8 text-water-glow mx-auto mb-2" />
            <div className="text-sm font-bold text-moonlight">Storm Warden</div>
            <div className="text-xs text-moonlight/60">Zero absences</div>
          </div>
          
          <div className="text-center p-3 bg-jungle-dark/50 rounded border border-jungle-light">
            <Zap className="h-8 w-8 text-fire-glow mx-auto mb-2" />
            <div className="text-sm font-bold text-moonlight">Shadow Explorer</div>
            <div className="text-xs text-moonlight/60">Max collaboration</div>
          </div>
          
          <div className="text-center p-3 bg-jungle-dark/50 rounded border border-jungle-light">
            <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-sm font-bold text-moonlight">Island Legend</div>
            <div className="text-xs text-moonlight/60">Top survivor</div>
          </div>
        </div>
      </Card>
    </div>
  );
}