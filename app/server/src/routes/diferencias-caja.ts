import { Router, Request, Response } from 'express';
import { Op } from 'sequelize';
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

// Crear diferencia de caja
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = diferenciaCajaCreateSchema.parse(req.body);
    const { fecha, ...rest } = validatedData;

    const diferencia = await DiferenciaCaja.create({
      ...rest,
      fecha: parseFecha(fecha),
      resuelta: rest.resuelta ?? false,
    });

    res.status(201).json(diferencia);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Datos inválidos', detalles: error.errors });
    } else if (error.message === 'Fecha inválida') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Listar diferencias de caja
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      skip = '0',
      limit = '100',
      idConteo,
      idUsuario,
      idTipoDiferencia,
      resuelta,
      fechaDesde,
      fechaHasta,
    } = req.query;

    const where: any = {};
    if (idConteo) where.idConteo = Number(idConteo);
    if (idUsuario) where.idUsuario = Number(idUsuario);
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

    res.json(diferencias);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener diferencia por ID
router.get('/:idDiferencia', async (req: Request, res: Response) => {
  try {
    const diferencia = await DiferenciaCaja.findByPk(req.params.idDiferencia);

    if (!diferencia) {
      return res.status(404).json({ error: 'Diferencia de caja no encontrada' });
    }

    res.json(diferencia);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar diferencia de caja
router.put('/:idDiferencia', async (req: Request, res: Response) => {
  try {
    const validatedData = diferenciaCajaCreateSchema.parse(req.body);
    const diferencia = await DiferenciaCaja.findByPk(req.params.idDiferencia);

    if (!diferencia) {
      return res.status(404).json({ error: 'Diferencia de caja no encontrada' });
    }

    const { fecha, ...rest } = validatedData;
    await diferencia.update({
      ...rest,
      fecha: parseFecha(fecha),
      resuelta: rest.resuelta ?? diferencia.resuelta,
    });

    res.json(diferencia);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Datos inválidos', detalles: error.errors });
    } else if (error.message === 'Fecha inválida') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Eliminar diferencia de caja
router.delete('/:idDiferencia', async (req: Request, res: Response) => {
  try {
    const diferencia = await DiferenciaCaja.findByPk(req.params.idDiferencia);

    if (!diferencia) {
      return res.status(404).json({ error: 'Diferencia de caja no encontrada' });
    }

    await diferencia.destroy();
    res.json({ mensaje: 'Diferencia de caja eliminada correctamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


