import { Router, Request, Response } from 'express';
import { Op } from 'sequelize';
import { BitacoraAuditoria } from '../models/BitacoraAuditoria';
import { bitacoraCreateSchema, bitacoraUpdateSchema } from '../schemas/bitacora';

const router = Router();

const parseFechaHora = (fechaHora?: string | Date) => {
  if (!fechaHora) return new Date();
  if (fechaHora instanceof Date) return fechaHora;
  const parsed = new Date(fechaHora);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Fecha u hora inválida');
  }
  return parsed;
};

// Crear una entrada de bitácora
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = bitacoraCreateSchema.parse(req.body);
    const { fechaHora, ...rest } = validatedData;

    const bitacora = await BitacoraAuditoria.create({
      ...rest,
      fechaHora: parseFechaHora(fechaHora),
    });

    return res.status(201).json(bitacora);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Datos inválidos', detalles: error.errors });
    } else if (error.message === 'Fecha u hora inválida') {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
});

// Listar entradas de bitácora
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      skip = '0',
      limit = '100',
      idUsuario,
      tablaModificada,
      fechaDesde,
      fechaHasta,
    } = req.query;

    const where: any = {};
    if (idUsuario) where.idUsuario = Number(idUsuario);
    if (tablaModificada) where.tablaModificada = tablaModificada;

    if (fechaDesde && fechaHasta) {
      where.fechaHora = {
        [Op.between]: [new Date(String(fechaDesde)), new Date(String(fechaHasta))],
      };
    } else if (fechaDesde) {
      where.fechaHora = {
        [Op.gte]: new Date(String(fechaDesde)),
      };
    } else if (fechaHasta) {
      where.fechaHora = {
        [Op.lte]: new Date(String(fechaHasta)),
      };
    }

    const bitacoras = await BitacoraAuditoria.findAll({
      where,
      limit: Number(limit),
      offset: Number(skip),
      order: [['fechaHora', 'DESC']],
    });

    return res.json(bitacoras);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Obtener una bitácora por ID
router.get('/:idBitacora', async (req: Request, res: Response) => {
  try {
    const bitacora = await BitacoraAuditoria.findByPk(req.params.idBitacora);

    if (!bitacora) {
      return res.status(404).json({ error: 'Bitácora no encontrada' });
    }

    return res.json(bitacora);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Actualizar una bitácora
router.put('/:idBitacora', async (req: Request, res: Response) => {
  try {
    const validatedData = bitacoraUpdateSchema.parse(req.body);
    if (Object.keys(validatedData).length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron datos para actualizar' });
    }
    const bitacora = await BitacoraAuditoria.findByPk(req.params.idBitacora);

    if (!bitacora) {
      return res.status(404).json({ error: 'Bitácora no encontrada' });
    }

    const { fechaHora, ...rest } = validatedData;
    await bitacora.update({
      ...rest,
      fechaHora: parseFechaHora(fechaHora),
    });

    return res.json(bitacora);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Datos inválidos', detalles: error.errors });
    } else if (error.message === 'Fecha u hora inválida') {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
});

// Eliminar una entrada de bitácora
router.delete('/:idBitacora', async (req: Request, res: Response) => {
  try {
    const bitacora = await BitacoraAuditoria.findByPk(req.params.idBitacora);

    if (!bitacora) {
      return res.status(404).json({ error: 'Bitácora no encontrada' });
    }

    await bitacora.destroy();
    return res.json({ mensaje: 'Bitácora eliminada correctamente' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;


