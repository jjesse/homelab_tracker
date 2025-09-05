import { Router, Request, Response } from 'express';

const router = Router();

// Example route
router.get('/', (req: Request, res: Response) => {
	res.send('Devices route');
});

export default router;
