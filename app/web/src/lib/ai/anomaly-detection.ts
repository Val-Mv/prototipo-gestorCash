/**
 * Detección de anomalías simplificada (sin Genkit/Next.js)
 * Esta es una versión mock que puede ser reemplazada por una implementación real
 */

export interface AnomalyDetectionInput {
  storeId: string;
  date: string;
  expenses: Array<{
    expenseId: string;
    category: string;
    item: string;
    amount: number;
    description: string;
    attachmentUrl: string | null;
  }>;
  salesCash: number;
  salesCard: number;
  totalDifference: number;
  customerCount: number;
}

export interface Anomaly {
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export interface AnomalyDetectionOutput {
  anomalies: Anomaly[];
  shouldSendAlert: boolean;
  summary: string;
}

/**
 * Detecta anomalías en los datos financieros del día
 */
export async function detectAnomaliesAndAlert(
  input: AnomalyDetectionInput
): Promise<AnomalyDetectionOutput> {
  const anomalies: Anomaly[] = [];
  let shouldSendAlert = false;

  // Detectar diferencia significativa
  if (Math.abs(input.totalDifference) > 50) {
    anomalies.push({
      type: 'Diferencia Significativa',
      message: `La diferencia de caja es de $${Math.abs(input.totalDifference).toFixed(2)}, que excede el umbral de $50.`,
      severity: 'high',
    });
    shouldSendAlert = true;
  } else if (Math.abs(input.totalDifference) > 20) {
    anomalies.push({
      type: 'Diferencia Moderada',
      message: `La diferencia de caja es de $${Math.abs(input.totalDifference).toFixed(2)}.`,
      severity: 'medium',
    });
  }

  // Detectar gastos inusuales
  const totalExpenses = input.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  if (totalExpenses > input.salesCash * 0.5) {
    anomalies.push({
      type: 'Gastos Elevados',
      message: `Los gastos totales ($${totalExpenses.toFixed(2)}) representan más del 50% de las ventas en efectivo.`,
      severity: 'medium',
    });
  }

  // Detectar gastos individuales muy altos
  const highExpenses = input.expenses.filter(exp => exp.amount > 100);
  if (highExpenses.length > 0) {
    anomalies.push({
      type: 'Gasto Individual Alto',
      message: `Se detectaron ${highExpenses.length} gasto(s) superior(es) a $100.`,
      severity: highExpenses.length > 2 ? 'high' : 'low',
    });
    if (highExpenses.length > 2) {
      shouldSendAlert = true;
    }
  }

  // Detectar ratio de clientes a ventas inusual
  if (input.customerCount > 0) {
    const avgSalePerCustomer = (input.salesCash + input.salesCard) / input.customerCount;
    if (avgSalePerCustomer < 5) {
      anomalies.push({
        type: 'Venta Promedio Baja',
        message: `La venta promedio por cliente es de $${avgSalePerCustomer.toFixed(2)}, lo cual es inusualmente bajo.`,
        severity: 'medium',
      });
    }
  }

  const summary = anomalies.length > 0
    ? `Se detectaron ${anomalies.length} anomalía(s). ${shouldSendAlert ? 'Se requiere atención inmediata.' : ''}`
    : 'No se detectaron anomalías significativas.';

  return {
    anomalies,
    shouldSendAlert,
    summary,
  };
}

