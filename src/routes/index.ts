import express from 'express';
import type { Request, Response } from 'express';
const { Router } = express;

const router = Router();

// Example route
router.get('/', (req: Request, res: Response) => {
	res.render('index');
});

export default router;
