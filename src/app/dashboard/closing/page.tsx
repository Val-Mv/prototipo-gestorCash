'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import { mockRegisters, mockExpenses } from '@/lib/data';
import type { AnomalyDetectionAndAlertingOutput } from '@/ai/flows/anomaly-detection-and-alerting';
import { runAnomalyDetection } from '@/app/actions/closing';

const registerFields = mockRegisters
  .filter(r => r.active)
  .reduce((acc, register) => {
    acc[`register${register.number}`] = z.coerce.number().min(0, 'Must be a positive number');
    return acc;
  }, {} as Record<string, z.ZodNumber>);

const formSchema = z.object({
  safe: z.coerce.number().min(0, 'Must be a positive number'),
  salesCash: z.coerce.number().min(0, 'Must be a positive number'),
  salesCard: z.coerce.number().min(0, 'Must be a positive number'),
  customerCount: z.coerce.number().int().min(0, 'Must be a positive integer'),
  ...registerFields,
});

type FormData = z.infer<typeof formSchema>;

export default function ClosingPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnomalyDetectionAndAlertingOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      safe: 0,
      salesCash: 0,
      salesCard: 0,
      customerCount: 0,
      ...mockRegisters.filter(r => r.active).reduce((acc, r) => ({ ...acc, [`register${r.number}`]: 75 }), {}),
    },
  });

  async function onSubmit(values: FormData) {
    setLoading(true);
    setError(null);
    setResult(null);

    const totalClosing = Object.keys(values)
      .filter(k => k.startsWith('register'))
      .reduce((sum, key) => sum + values[key as keyof FormData], 0);
      
    const openingAmount = mockRegisters.filter(r => r.active).length * 75;
    const totalDifference = (totalClosing + values.safe) - (openingAmount + values.salesCash);

    try {
      const res = await runAnomalyDetection({
        storeId: 'berwyn-il',
        date: new Date().toISOString().split('T')[0],
        expenses: mockExpenses.map(e => ({
            expenseId: e.id,
            category: e.category,
            item: e.item,
            amount: e.amount,
            description: e.description,
            attachmentUrl: e.attachmentUrl || null,
        })),
        salesCash: values.salesCash,
        salesCard: values.salesCard,
        totalDifference,
        customerCount: values.customerCount
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">End-of-Day Closing</CardTitle>
              <CardDescription>Enter final counts for all registers and the safe. The system will calculate discrepancies and run anomaly detection.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Register Counts</h3>
                {mockRegisters.filter(r => r.active).map(register => (
                  <FormField
                    key={register.id}
                    control={form.control}
                    name={`register${register.number}` as keyof FormData}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Register #{register.number}</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="75.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                 <FormField
                  control={form.control}
                  name="safe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Safe Count</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Sales & Customer Data</h3>
                <FormField
                  control={form.control}
                  name="salesCash"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Cash Sales</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salesCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Card Sales</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Count</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
              <Button type="submit" disabled={loading} className="w-full md:w-auto">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze & Close Day
              </Button>
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Analysis Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {result && (
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShieldAlert /> Analysis Complete</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.anomalies.length > 0 ? (
                      <>
                        <Alert variant={result.shouldSendAlert ? 'destructive' : 'default'}>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>{result.anomalies.length} {result.anomalies.length === 1 ? 'Anomaly' : 'Anomalies'} Detected</AlertTitle>
                          <AlertDescription>
                            <ul className="list-disc pl-5 space-y-1 mt-2">
                                {result.anomalies.map((anomaly, i) => <li key={i}><strong>{anomaly.type}:</strong> {anomaly.message}</li>)}
                            </ul>
                          </AlertDescription>
                        </Alert>
                        {result.shouldSendAlert && (
                            <p className="mt-4 text-sm font-semibold text-destructive">An alert has been automatically sent to management due to the severity of the anomalies.</p>
                        )}
                      </>
                    ) : (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>No Anomalies Detected</AlertTitle>
                        <AlertDescription>The AI analysis found no significant issues with today's data.</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
