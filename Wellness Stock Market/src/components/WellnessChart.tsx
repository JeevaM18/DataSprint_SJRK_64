import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity, User, Users, Trophy } from 'lucide-react';

const performanceData = [
  { metric: 'Steps Today', individual: '8,240', department: '7,895', target: '10,000' },
  { metric: 'Calories Burned', individual: '345', department: '312', target: '400' },
  { metric: 'Active Minutes', individual: '42', department: '38', target: '60' },
  { metric: 'Wellness Score', individual: '88', department: '85', target: '90' },
  { metric: 'Weekly Streak', individual: '5 days', department: '4.2 days', target: '7 days' },
];

export const WellnessChart = () => {
  return (
    <Card className="financial-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-warning" />
          Performance Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <User className="h-4 w-4" />
                  You
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Users className="h-4 w-4" />
                  Department
                </div>
              </TableHead>
              <TableHead className="text-center">Target</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {performanceData.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{row.metric}</TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant="outline" 
                    className="bg-primary/10 text-primary border-primary"
                  >
                    {row.individual}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant="outline" 
                    className="bg-success/10 text-success border-success"
                  >
                    {row.department}
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {row.target}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};