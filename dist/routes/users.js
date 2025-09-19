import { Router } from 'express';
const router = Router();
// Example route
router.get('/', (req, res) => {
    res.send('Users route');
});
export default router;
