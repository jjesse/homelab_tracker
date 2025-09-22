import express from 'express';
const { Router } = express;
const router = Router();
// Example route
router.get('/', (req, res) => {
    res.render('index');
});
export default router;
