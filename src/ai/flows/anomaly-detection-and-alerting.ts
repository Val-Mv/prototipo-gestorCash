'use server';
/**
 * @fileOverview An anomaly detection and alerting AI agent.
 *
 * - detectAnomaliesAndAlert - A function that handles the anomaly detection and alerting process.
 * - AnomalyDetectionAndAlertingInput - The input type for the detectAnomaliesAndAlert function.
 * - AnomalyDetectionAndAlertingOutput - The return type for the detectAnomaliesAndAlert function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnomalyDetectionAndAlertingInputSchema = z.object({
  storeId: z.string().describe('The ID of the store to analyze.'),
  date: z.string().describe('The date for which to detect anomalies (YYYY-MM-DD).'),
  expenses: z.array(
    z.object({
      expenseId: z.string(),
      category: z.string(),
      item: z.string(),
      amount: z.number(),
      description: z.string(),
      attachmentUrl: z.string().nullable(),
    })
  ).describe('The list of expenses for the given store and date.'),
  salesCash: z.number().describe('Total cash sales for the day.'),
  salesCard: z.number().describe('Total card sales for the day.'),
  totalDifference: z.number().describe('Total over/short amount for the day.'),
  customerCount: z.number().describe('Total customer count for the day.'),
});
export type AnomalyDetectionAndAlertingInput = z.infer<typeof AnomalyDetectionAndAlertingInputSchema>;

const AnomalyDetectionAndAlertingOutputSchema = z.object({
  anomalies: z.array(
    z.object({
      type: z.string(),
      message: z.string(),
      expenseId: z.string().optional(),
    })
  ).describe('A list of detected anomalies with their type and message.'),
  shouldSendAlert: z.boolean().describe('Whether an alert email should be sent to management.'),
});
export type AnomalyDetectionAndAlertingOutput = z.infer<typeof AnomalyDetectionAndAlertingOutputSchema>;

export async function detectAnomaliesAndAlert(input: AnomalyDetectionAndAlertingInput): Promise<AnomalyDetectionAndAlertingOutput> {
  return anomalyDetectionAndAlertingFlow(input);
}

const anomalyDetectionPrompt = ai.definePrompt({
  name: 'anomalyDetectionPrompt',
  input: {schema: AnomalyDetectionAndAlertingInputSchema},
  output: {schema: AnomalyDetectionAndAlertingOutputSchema},
  prompt: `You are an expert anomaly detection system for a Dollar Tree store.

You are provided with daily sales, expense, and customer data for a specific store.
Your task is to identify any unusual patterns or discrepancies that warrant further investigation.

Consider the following factors when detecting anomalies:

*   Significant deviations from expected expense amounts for each category.
*   Unusual cash over/short amounts.
*   Unexpected changes in customer count.
*   Inconsistencies between expense descriptions and categories.


For each potential anomaly, provide a clear and concise message explaining the issue.

Here's the data for store {{{storeId}}} on {{{date}}}:

Sales (Cash): ${{{salesCash}}}
Sales (Card): ${{{salesCard}}}
Total Over/Short: ${{{totalDifference}}}
Customer Count: {{{customerCount}}}

Expenses:
{{#each expenses}}
*   Category: {{{category}}}, Item: {{{item}}}, Amount: ${{{amount}}}, Description: {{{description}}}, Attachment: {{{attachmentUrl}}}
{{/each}}

Based on this data, identify any anomalies and determine if an alert email should be sent to management.
`,
});

const attachmentVeracityCheck = ai.defineTool(
  {
    name: 'checkAttachmentVeracity',
    description: 'Checks the veracity of an image attachment using generative AI techniques to ensure it aligns with the expense description and category.',
    inputSchema: z.object({
      attachmentUrl: z.string().describe('URL of the image attachment.'),
      expenseDescription: z.string().describe('Description of the expense.'),
      expenseCategory: z.string().describe('Category of the expense.'),
    }),
    outputSchema: z.boolean().describe('True if the attachment is verified, false otherwise.'),
  },
  async (input) => {
    // Placeholder implementation for attachment veracity check
    // In a real-world scenario, this would involve using a generative AI model
    // to analyze the image and determine if it is consistent with the
    // expense description and category.
    console.log("checking attachment " + input.attachmentUrl);
    return true; // Assume attachment is verified for now
  }
);

const anomalyDetectionAndAlertingFlow = ai.defineFlow(
  {
    name: 'anomalyDetectionAndAlertingFlow',
    inputSchema: AnomalyDetectionAndAlertingInputSchema,
    outputSchema: AnomalyDetectionAndAlertingOutputSchema,
  },
  async input => {
    const {output} = await anomalyDetectionPrompt(input);
    const finalOutput = output!;

    // After anomaly detection, check if any expense attachments need veracity checks
    if (input.expenses) {
      for (const expense of input.expenses) {
        if (expense.attachmentUrl) {
          const isVerified = await attachmentVeracityCheck({
            attachmentUrl: expense.attachmentUrl,
            expenseDescription: expense.description,
            expenseCategory: expense.category,
          });

          if (!isVerified) {
            finalOutput.anomalies.push({
              type: 'Attachment Veracity',
              message: `The attachment for expense ${expense.expenseId} does not match the description and category.`,
              expenseId: expense.expenseId,
            });
            finalOutput.shouldSendAlert = true;
          }
        }
      }
    }


    return finalOutput;
  }
);
