'use server';

import { detectAnomaliesAndAlert, AnomalyDetectionAndAlertingInput } from '@/ai/flows/anomaly-detection-and-alerting';

export async function runAnomalyDetection(input: AnomalyDetectionAndAlertingInput) {
  try {
    const result = await detectAnomaliesAndAlert(input);
    return result;
  } catch (error) {
    console.error("Error in anomaly detection flow:", error);
    throw new Error("Failed to run anomaly detection. Please check the logs.");
  }
}
