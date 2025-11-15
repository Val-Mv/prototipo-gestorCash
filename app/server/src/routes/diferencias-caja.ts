import { Router, Request, Response } from 'express';
import { Op } from 'sequelize';
import { ZodError } from 'zod';
import { DiferenciaCaja } from '../models/DiferenciaCaja';
import { diferenciaCajaCreateSchema } from '../schemas/diferencia-caja';

const router = Router();

const parseFecha = (fecha?: string | Date) => {
  if (!fecha) return new Date();
  if (fecha instanceof Date) return fecha;
  const parsed = new Date(fecha);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Fecha inválida');
  }
  return parsed;
};

// Función centralizada para manejar errores de las rutas
const handleRouteError = (error: any, res: Response) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ error: 'Datos inválidos', detalles: error.errors });
  }
  if (error instanceof Error && (error.message === 'Fecha inválida' || error.message.includes('no encontrada'))) {
    const statusCode = error.message.includes('no encontrada') ? 404 : 400;
    return res.status(statusCode).json({ error: error.message });
  }
  console.error('Error inesperado:', error);
  return res.status(500).json({ error: 'Error interno del servidor' });
};

// Crear diferencia de caja
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = diferenciaCajaCreateSchema.parse(req.body);
    const { fecha, montoReal, montoEsperado, ...rest } = validatedData;
    const diferenciaCalculada = montoReal - montoEsperado;

    const nuevaDiferencia = await DiferenciaCaja.create({
      ...rest,
      montoReal,
      montoEsperado,
      diferencia: diferenciaCalculada,
      fecha: parseFecha(fecha),
      resuelta: rest.resuelta ?? false,
    });

    return res.status(201).json(nuevaDiferencia);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
});

// Listar diferencias de caja
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      skip = '0',
      limit = '100',
      idConteo,
      idTipoDiferencia,
      resuelta,
      fechaDesde,
      fechaHasta,
    } = req.query;

    const where: any = {};
    if (idConteo) where.idConteo = Number(idConteo);
    if (idTipoDiferencia) where.idTipoDiferencia = Number(idTipoDiferencia);
    if (typeof resuelta === 'string') {
      where.resuelta = resuelta === 'true';
    }

    if (fechaDesde && fechaHasta) {
      where.fecha = {
        [Op.between]: [new Date(String(fechaDesde)), new Date(String(fechaHasta))],
      };
    } else if (fechaDesde) {
      where.fecha = {
        [Op.gte]: new Date(String(fechaDesde)),
      };
    } else if (fechaHasta) {
      where.fecha = {
        [Op.lte]: new Date(String(fechaHasta)),
      };
    }

    const diferencias = await DiferenciaCaja.findAll({
      where,
      limit: Number(limit),
      offset: Number(skip),
      order: [['fecha', 'DESC']],
    });

    return res.json(diferencias);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
});

// Obtener diferencia por ID
router.get('/:idDiferencia', async (req: Request, res: Response) => {
  try {
    const diferencia = await DiferenciaCaja.findByPk(req.params.idDiferencia);

    if (!diferencia) throw new Error('Diferencia de caja no encontrada');

    return res.json(diferencia);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
});

// Actualizar diferencia de caja
router.put('/:idDiferencia', async (req: Request, res: Response) => {
  try {
    const validatedData = diferenciaCajaCreateSchema.parse(req.body);
    const diferencia = await DiferenciaCaja.findByPk(req.params.idDiferencia);

    if (!diferencia) throw new Error('Diferencia de caja no encontrada');

    const { fecha, montoReal, montoEsperado, ...rest } = validatedData;
    const diferenciaCalculada = montoReal - montoEsperado;

    await diferencia.update({
      ...rest,
      montoReal,
      montoEsperado,
      diferencia: diferenciaCalculada,
      fecha: parseFecha(fecha),
      resuelta: rest.resuelta ?? diferencia.resuelta,
    });

    return res.json(diferencia);
  } catch (error: any) {
    return handleRouteError(error, res);
  }
});

// Eliminar diferencia de caja
router.delete('/:idDiferencia', async (req: Request, res: Response) => {
  try {
    const diferencia = await DiferenciaCaja.findByPk(req.params.idDiferencia);

    if (!diferencia) throw new Error('Diferencia de caja no encontrada');

    await diferencia.destroy();
    return res.json({ mensaje: 'Diferencia de caja eliminada correctamente' });
  } catch (error: any) {
    return handleRouteError(error, res);
  }
});

export default router;
