import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'LearnPath API',
    timestamp: new Date().toISOString()
  });
});

export default router;
