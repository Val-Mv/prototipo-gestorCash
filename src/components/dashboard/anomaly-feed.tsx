import { ShieldAlert, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockDailyReports } from '@/lib/data';
import { ScrollArea } from '@/components/ui/scroll-area';

export async function AnomalyFeed() {
  const anomalies = mockDailyReports
    .flatMap(report => report.anomalies.map(anomaly => ({...anomaly, date: report.date})))
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-primary"/>
            Anomaly Feed
        </CardTitle>
        <CardDescription>Recent AI-detected potential issues.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[250px]">
        {anomalies.length > 0 ? (
          <div className="space-y-4">
            {anomalies.map((anomaly, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                    <ShieldAlert className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-medium">{anomaly.type}</p>
                  <p className="text-sm text-muted-foreground">{anomaly.message}</p>
                   <p className="text-xs text-muted-foreground">{new Date(anomaly.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-[200px] flex-col items-center justify-center text-center">
             <Info className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No Anomalies Found</p>
            <p className="text-xs text-muted-foreground">The system has not detected any issues recently.</p>
          </div>
        )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
