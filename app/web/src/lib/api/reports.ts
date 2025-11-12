import { apiRequest } from '@/lib/api-config';

export interface ReporteDiario {
  idReporte: number;
  fecha: string;
  totalVentas: number;
  saldoFinal: number;
  totalClientes: number;
  totalEfectivo: number;
  totalTarjeta: number;
  totalGastosDia: number;
  totalDiferencias: number;
  idUsuarioGenerador: number;
}

export async function obtenerReportesDiarios(params?: {
  fechaDesde?: string;
  fechaHasta?: string;
  skip?: number;
  limit?: number;
}): Promise<ReporteDiario[]> {
  const query = new URLSearchParams();

  if (params?.fechaDesde) query.append('fechaDesde', params.fechaDesde);
  if (params?.fechaHasta) query.append('fechaHasta', params.fechaHasta);
  if (typeof params?.skip === 'number') query.append('skip', params.skip.toString());
  if (typeof params?.limit === 'number') query.append('limit', params.limit.toString());

  const qs = query.toString();
  return apiRequest<ReporteDiario[]>(`/api/reportes-diarios${qs ? `?${qs}` : ''}`);
}

export async function crearReporteDiario(payload: Omit<ReporteDiario, 'idReporte'>): Promise<ReporteDiario> {
  return apiRequest<ReporteDiario>('/api/reportes-diarios', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}


