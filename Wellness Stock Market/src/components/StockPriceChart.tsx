import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface TeamStock {
  ticker: string;
  teamName: string;
  price: number;
  change: number;
  changePercent: number;
}

interface StockPriceChartProps {
  stocks: TeamStock[];
}

const generateMockHistoricalData = (stocks: TeamStock[]) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  return days.map((day, index) => {
    const dataPoint: any = { day };

    stocks.forEach(stock => {
      const basePrice = stock.price;
      const volatility = 0.05; 
      const randomChange = (Math.random() - 0.5) * 2 * volatility;
      const dailyPrice = basePrice * (1 + randomChange - (4 - index) * 0.01);

      dataPoint[stock.teamName] = Math.max(dailyPrice, basePrice * 0.8);
    });

    return dataPoint;
  });
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-2">{`Day: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.dataKey}:</span>
            <span className="font-semibold text-foreground">
              ${entry.value?.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const StockPriceChart = ({ stocks }: StockPriceChartProps) => {
  const chartData = generateMockHistoricalData(stocks);

  // ✅ Extended palette (15 distinct colors)
  const colors = [
    "#2563eb", // Blue
    "#16a34a", // Green
    "#f59e0b", // Amber
    "#dc2626", // Red
    "#9333ea", // Purple
    "#0891b2", // Cyan
    "#ca8a04", // Yellow
    "#ea580c", // Orange
    "#4b5563", // Gray
    "#0d9488", // Teal
    "#c026d3", // Magenta
    "#0284c7", // Sky Blue
    "#65a30d", // Lime
    "#b91c1c", // Dark Red
    "#475569", // Slate
  ];

  return (
    <Card className="financial-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Department Stock Prices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.3)" />
            <XAxis 
              dataKey="day" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                color: 'hsl(var(--foreground))',
                fontSize: '12px'
              }}
            />
            {stocks.map((stock, index) => (
              <Line
                key={stock.teamName}
                type="monotone"
                dataKey={stock.teamName}
                name={stock.teamName}
                stroke={colors[index % colors.length]} // ✅ always assigns a color
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  className: "animate-pulse"
                }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
