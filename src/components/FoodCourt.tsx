import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Apple, Zap, Shield, Skull } from 'lucide-react';
import foodData from '@/data/foodData.json';

interface Food {
  "Dish Name": string;
  "Calories (kcal)": number;
  "Protein (g)": number;
  "Carbohydrates (g)": number;
  "Fats (g)": number;
  "Detailed_Category": string;
  "Broad_Category": string;
}

export function FoodCourt() {
  const [selectedEmployee, setSelectedEmployee] = useState('John Doe');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [consumedFoods, setConsumedFoods] = useState<string[]>([]);

  const employees = [
    { name: 'John Doe', diet: 'Vegetarian', allergies: 'Nuts', goal: 'Weight Loss' },
    { name: 'Sarah Smith', diet: 'Non-Vegetarian', allergies: 'None', goal: 'Muscle Gain' },
    { name: 'Mike Johnson', diet: 'Vegetarian', allergies: 'Lactose', goal: 'Energy Boost' }
  ];

  const currentEmployee = employees.find(emp => emp.name === selectedEmployee);

  const filteredFoods = foodData.filter((food: Food) => {
    const matchesSearch = food["Dish Name"].toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || food["Broad_Category"] === selectedCategory;
    
    // Apply dietary restrictions
    if (currentEmployee?.diet === 'Vegetarian') {
      const isNonVeg = food["Dish Name"].toLowerCase().includes('chicken') || 
                     food["Dish Name"].toLowerCase().includes('mutton') ||
                     food["Dish Name"].toLowerCase().includes('fish');
      if (isNonVeg) return false;
    }

    // Apply allergy restrictions
    if (currentEmployee?.allergies === 'Nuts' && food["Dish Name"].toLowerCase().includes('nut')) {
      return false;
    }
    if (currentEmployee?.allergies === 'Lactose' && 
        (food["Dish Name"].toLowerCase().includes('paneer') || 
         food["Dish Name"].toLowerCase().includes('lassi'))) {
      return false;
    }

    return matchesSearch && matchesCategory;
  });

  const getFoodEffect = (food: Food) => {
    const calories = food["Calories (kcal)"];
    const protein = food["Protein (g)"];

    if (calories < 150) {
      return { type: 'healthy', icon: Shield, text: 'Energy boost! +25% stamina', color: 'text-accent' };
    } else if (calories > 300) {
      return { type: 'junk', icon: Skull, text: 'Heavy meal! -15% speed', color: 'text-destructive' };
    } else if (protein > 10) {
      return { type: 'balanced', icon: Zap, text: 'Balanced nutrition! +10% all stats', color: 'text-water-glow' };
    } else {
      return { type: 'normal', icon: Apple, text: 'Standard nutrition', color: 'text-moonlight' };
    }
  };

  const consumeFood = (foodName: string) => {
    setConsumedFoods([...consumedFoods, foodName]);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-jungle-medium/90 border-jungle-light p-6 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-moonlight mb-6 flex items-center gap-2">
          <Apple className="h-6 w-6 text-accent" />
          Shadow Food Court
        </h2>

        {/* Employee Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm text-moonlight/70 mb-2 block">Survivor</label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="bg-jungle-dark border-jungle-light text-moonlight">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-jungle-medium border-jungle-light">
                {employees.map(emp => (
                  <SelectItem key={emp.name} value={emp.name} className="text-moonlight hover:bg-jungle-light">
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentEmployee && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-jungle-light text-moonlight">
                  {currentEmployee.diet}
                </Badge>
                <Badge variant="outline" className="border-jungle-light text-moonlight/70">
                  Allergies: {currentEmployee.allergies}
                </Badge>
              </div>
              <Badge variant="default" className="bg-accent text-jungle-dark">
                Goal: {currentEmployee.goal}
              </Badge>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            placeholder="Search mystical foods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-jungle-dark border-jungle-light text-moonlight placeholder:text-moonlight/50"
          />
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-jungle-dark border-jungle-light text-moonlight">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-jungle-medium border-jungle-light">
              <SelectItem value="all" className="text-moonlight hover:bg-jungle-light">All Categories</SelectItem>
              <SelectItem value="Main Dish" className="text-moonlight hover:bg-jungle-light">Main Dish</SelectItem>
              <SelectItem value="Side Dish" className="text-moonlight hover:bg-jungle-light">Side Dish</SelectItem>
              <SelectItem value="Dessert" className="text-moonlight hover:bg-jungle-light">Dessert</SelectItem>
              <SelectItem value="Drinks" className="text-moonlight hover:bg-jungle-light">Drinks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Food Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFoods.map((food: Food) => {
          const effect = getFoodEffect(food);
          const isConsumed = consumedFoods.includes(food["Dish Name"]);
          const EffectIcon = effect.icon;

          return (
            <Card key={food["Dish Name"]} className="bg-jungle-medium/90 border-jungle-light p-4 backdrop-blur-sm hover:bg-jungle-light/50 transition-colors">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-moonlight text-sm">{food["Dish Name"]}</h3>
                  <Badge variant="outline" className="text-xs border-jungle-light text-moonlight/60">
                    {food["Broad_Category"]}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-moonlight/70">
                  <div>Calories: {food["Calories (kcal)"]} kcal</div>
                  <div>Protein: {food["Protein (g)"]}g</div>
                  <div>Carbs: {food["Carbohydrates (g)"]}g</div>
                  <div>Fats: {food["Fats (g)"]}g</div>
                </div>

                <div className={`flex items-center gap-2 text-xs ${effect.color}`}>
                  <EffectIcon className="h-4 w-4" />
                  <span>{effect.text}</span>
                </div>

                <Button
                  onClick={() => consumeFood(food["Dish Name"])}
                  disabled={isConsumed}
                  variant={isConsumed ? "secondary" : "default"}
                  size="sm"
                  className="w-full bg-accent hover:bg-accent/80 text-jungle-dark disabled:bg-jungle-light disabled:text-moonlight/50"
                >
                  {isConsumed ? 'Consumed' : 'Consume'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Daily Missions */}
      <Card className="bg-jungle-medium/90 border-jungle-light p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-moonlight mb-4">🌙 Daily Missions</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-moonlight/70">
            <input type="checkbox" className="rounded bg-jungle-dark border-jungle-light" />
            <span>Consume 1 balanced meal → +20 food points</span>
          </div>
          <div className="flex items-center gap-2 text-moonlight/70">
            <input type="checkbox" className="rounded bg-jungle-dark border-jungle-light" />
            <span>Try a high-protein dish → +15 exploration points</span>
          </div>
          <div className="flex items-center gap-2 text-moonlight/70">
            <input type="checkbox" className="rounded bg-jungle-dark border-jungle-light" />
            <span>Avoid junk food → +10 health points</span>
          </div>
        </div>
      </Card>
    </div>
  );
}