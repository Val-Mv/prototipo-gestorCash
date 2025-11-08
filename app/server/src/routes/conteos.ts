import { Router, Request, Response } from 'express';
import { Op } from 'sequelize';
import { Conteo } from '../models/Conteo';
import { conteoCreateSchema } from '../schemas/conteo';

const router = Router();

const parseFechaHora = (fecha?: string | Date) => {
  if (!fecha) return new Date();
  if (fecha instanceof Date) return fecha;
  const parsed = new Date(fecha);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Fecha u hora inválida');
  }
  return parsed;
};

// Crear un conteo
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = conteoCreateSchema.parse(req.body);
    const { fechaHora, ...rest } = validatedData;

    const conteo = await Conteo.create({
      ...rest,
      fechaHora: parseFechaHora(fechaHora),
    });

    return res.status(201).json(conteo);
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

// Listar conteos
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      skip = '0',
      limit = '100',
      idCaja,
      idUsuario,
      idTipoConteo,
      idReporte,
      fechaDesde,
      fechaHasta,
    } = req.query;

    const where: any = {};
    if (idCaja) where.idCaja = Number(idCaja);
    if (idUsuario) where.idUsuario = Number(idUsuario);
    if (idTipoConteo) where.idTipoConteo = Number(idTipoConteo);
    if (idReporte) where.idReporte = Number(idReporte);

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

    const conteos = await Conteo.findAll({
      where,
      limit: Number(limit),
      offset: Number(skip),
      order: [['fechaHora', 'DESC']],
    });

    return res.json(conteos);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Obtener conteo por ID
router.get('/:idConteo', async (req: Request, res: Response) => {
  try {
    const conteo = await Conteo.findByPk(req.params.idConteo);

    if (!conteo) {
      return res.status(404).json({ error: 'Conteo no encontrado' });
    }

    return res.json(conteo);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Actualizar conteo
router.put('/:idConteo', async (req: Request, res: Response) => {
  try {
    const validatedData = conteoCreateSchema.parse(req.body);
    const conteo = await Conteo.findByPk(req.params.idConteo);

    if (!conteo) {
      return res.status(404).json({ error: 'Conteo no encontrado' });
    }

    const { fechaHora, ...rest } = validatedData;
    await conteo.update({
      ...rest,
      fechaHora: parseFechaHora(fechaHora),
    });

    return res.json(conteo);
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

// Eliminar conteo
router.delete('/:idConteo', async (req: Request, res: Response) => {
  try {
    const conteo = await Conteo.findByPk(req.params.idConteo);

    if (!conteo) {
      return res.status(404).json({ error: 'Conteo no encontrado' });
    }

    await conteo.destroy();
    return res.json({ mensaje: 'Conteo eliminado correctamente' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;


