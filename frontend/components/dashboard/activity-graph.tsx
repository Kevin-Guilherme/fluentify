import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ActivityGraphProps {
  weeklyActivity: {
    day: string;
    count: number;
  }[];
}

export function ActivityGraph({ weeklyActivity }: ActivityGraphProps) {
  const maxCount = Math.max(...weeklyActivity.map((d) => d.count), 1);

  return (
    <Card className="card-enhanced">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Weekly Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-3 h-48">
          {weeklyActivity.map((day) => {
            const heightPercentage = (day.count / maxCount) * 100;
            return (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-green-500/30 to-green-400/20 border-2 border-green-500/60 rounded-lg flex items-center justify-center text-xs font-bold text-white transition-all duration-300 hover:from-green-500/40 hover:to-green-400/30 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30"
                  style={{ height: `${heightPercentage}%`, minHeight: '32px' }}
                >
                  {day.count}
                </div>
                <span className="text-xs font-semibold text-gray-300">{day.day}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
