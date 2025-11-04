'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { mockRegisters } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';

const REQUIRED_OPENING_AMOUNT = 75;

const registerFields = mockRegisters
  .filter(r => r.active)
  .reduce((acc, register) => {
    acc[`register${register.number}`] = z.coerce
      .number()
      .min(0, 'Must be a positive number')
    return acc;
  }, {} as Record<string, z.ZodNumber>);
  
const formSchema = z.object(registerFields);
type FormData = z.infer<typeof formSchema>;


export default function OpeningPage() {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: mockRegisters.filter(r => r.active).reduce((acc, r) => ({ ...acc, [`register${r.number}`]: REQUIRED_OPENING_AMOUNT }), {}),
  });

  function onSubmit(values: FormData) {
    let hasError = false;
    Object.entries(values).forEach(([key, value]) => {
        if (value !== REQUIRED_OPENING_AMOUNT) {
            form.setError(key as keyof FormData, {
                type: 'manual',
                message: `Count must be exactly $${REQUIRED_OPENING_AMOUNT}.`
            });
            hasError = true;
        }
    });

    if (hasError) {
        toast({
            variant: "destructive",
            title: "Incorrect Opening Count",
            description: "One or more registers have an incorrect opening balance. Please correct them.",
        });
    } else {
        toast({
            title: "Opening Counts Saved",
            description: "All register counts have been successfully recorded.",
        });
        console.log("Opening counts submitted:", values);
    }
  }

  return (
    <div className="container mx-auto py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="font-headline">Shift Opening Count</CardTitle>
              <CardDescription>Enter the starting cash amount for each active register. Each should have exactly {`$${REQUIRED_OPENING_AMOUNT}`}.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
                {mockRegisters.filter(r => r.active).map(register => (
                  <FormField
                    key={register.id}
                    control={form.control}
                    name={`register${register.number}` as keyof FormData}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                            Register #{register.number}
                            {form.getValues()[`register${register.number}` as keyof FormData] !== REQUIRED_OPENING_AMOUNT &&
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                            }
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="75.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
            </CardContent>
            <CardFooter>
              <Button type="submit">Save Opening Counts</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
