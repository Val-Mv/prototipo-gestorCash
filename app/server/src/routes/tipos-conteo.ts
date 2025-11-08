import { Router, Request, Response } from 'express';
import { TipoConteo } from '../models/TipoConteo';
import { tipoConteoCreateSchema } from '../schemas/tipo-conteo';

const router = Router();

// Crear tipo de conteo
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = tipoConteoCreateSchema.parse(req.body);
    const tipo = await TipoConteo.create(validatedData);
    return res.status(201).json(tipo);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Datos inválidos', detalles: error.errors });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
});

// Listar tipos de conteo
router.get('/', async (_req: Request, res: Response) => {
  try {
    const tipos = await TipoConteo.findAll({ order: [['nombreTipo', 'ASC']] });
    return res.json(tipos);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Obtener tipo por ID
router.get('/:idTipoConteo', async (req: Request, res: Response) => {
  try {
    const tipo = await TipoConteo.findByPk(req.params.idTipoConteo);

    if (!tipo) {
      return res.status(404).json({ error: 'Tipo de conteo no encontrado' });
    }

    return res.json(tipo);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Actualizar tipo de conteo
router.put('/:idTipoConteo', async (req: Request, res: Response) => {
  try {
    const validatedData = tipoConteoCreateSchema.parse(req.body);
    const tipo = await TipoConteo.findByPk(req.params.idTipoConteo);

    if (!tipo) {
      return res.status(404).json({ error: 'Tipo de conteo no encontrado' });
    }

    await tipo.update(validatedData);
    return res.json(tipo);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Datos inválidos', detalles: error.errors });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
});

// Eliminar tipo de conteo
router.delete('/:idTipoConteo', async (req: Request, res: Response) => {
  try {
    const tipo = await TipoConteo.findByPk(req.params.idTipoConteo);

    if (!tipo) {
      return res.status(404).json({ error: 'Tipo de conteo no encontrado' });
    }

    await tipo.destroy();
    return res.json({ mensaje: 'Tipo de conteo eliminado correctamente' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;


