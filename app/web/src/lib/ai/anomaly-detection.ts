/**
 * Detección de anomalías simplificada (sin Genkit/Next.js)
 * Esta es una versión mock que puede ser reemplazada por una implementación real
 */

export interface EntradaDeteccionAnomalias {
  idTienda: string;
  fecha: string;
  gastos: Array<{
    idGasto: number;
    idCategoria: number;
    monto: number;
    descripcion: string;
  }>;
  ventasEfectivo: number;
  ventasTarjeta: number;
  diferenciaTotal: number;
  cantidadClientes: number;
}

export interface Anomalia {
  tipo: string;
  mensaje: string;
  severidad: 'baja' | 'media' | 'alta';
}

export interface SalidaDeteccionAnomalias {
  anomalias: Anomalia[];
  debeEnviarAlerta: boolean;
  resumen: string;
}

/**
 * Detecta anomalías en los datos financieros del día
 */
export async function detectarAnomaliasYAlertar(
  entrada: EntradaDeteccionAnomalias
): Promise<SalidaDeteccionAnomalias> {
  const anomalias: Anomalia[] = [];
  let debeEnviarAlerta = false;

  // Detectar diferencia significativa
  if (Math.abs(entrada.diferenciaTotal) > 50) {
    anomalias.push({
      tipo: 'Diferencia Significativa',
      mensaje: `La diferencia de caja es de $${Math.abs(entrada.diferenciaTotal).toFixed(2)}, que excede el umbral de $50.`,
      severidad: 'alta',
    });
    debeEnviarAlerta = true;
  } else if (Math.abs(entrada.diferenciaTotal) > 20) {
    anomalias.push({
      tipo: 'Diferencia Moderada',
      mensaje: `La diferencia de caja es de $${Math.abs(entrada.diferenciaTotal).toFixed(2)}.`,
      severidad: 'media',
    });
  }

  // Detectar gastos inusuales
  const totalGastos = entrada.gastos.reduce((sum, gasto) => sum + Number(gasto.monto), 0);
  if (totalGastos > entrada.ventasEfectivo * 0.5) {
    anomalias.push({
      tipo: 'Gastos Elevados',
      mensaje: `Los gastos totales ($${totalGastos.toFixed(2)}) representan más del 50% de las ventas en efectivo.`,
      severidad: 'media',
    });
  }

  // Detectar gastos individuales muy altos
  const gastosAltos = entrada.gastos.filter((gasto) => Number(gasto.monto) > 100);
  if (gastosAltos.length > 0) {
    anomalias.push({
      tipo: 'Gasto Individual Alto',
      mensaje: `Se detectaron ${gastosAltos.length} gasto(s) superior(es) a $100.`,
      severidad: gastosAltos.length > 2 ? 'alta' : 'baja',
    });
    if (gastosAltos.length > 2) {
      debeEnviarAlerta = true;
    }
  }

  // Detectar ratio de clientes a ventas inusual
  if (entrada.cantidadClientes > 0) {
    const ventaPromedioPorCliente =
      (entrada.ventasEfectivo + entrada.ventasTarjeta) / entrada.cantidadClientes;
    if (ventaPromedioPorCliente < 5) {
      anomalias.push({
        tipo: 'Venta Promedio Baja',
        mensaje: `La venta promedio por cliente es de $${ventaPromedioPorCliente.toFixed(2)}, lo cual es inusualmente bajo.`,
        severidad: 'media',
      });
    }
  }

  const resumen =
    anomalias.length > 0
      ? `Se detectaron ${anomalias.length} anomalía(s). ${
          debeEnviarAlerta ? 'Se requiere atención inmediata.' : ''
        }`
      : 'No se detectaron anomalías significativas.';

  return {
    anomalias,
    debeEnviarAlerta,
    resumen,
  };
}

