const router = require('express').Router();
const c = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Student's own record
router.get('/me', protect, authorize('student'), c.getMine);

// Stats for teacher dashboard
router.get('/stats/summary', protect, authorize('teacher'), c.stats);

// Teacher CRUD
router.get('/', protect, authorize('teacher'), c.list);
router.get('/:id', protect, authorize('teacher'), c.getOne);
router.post('/', protect, authorize('teacher'), c.create);
router.put('/:id', protect, authorize('teacher'), c.update);
router.delete('/:id', protect, authorize('teacher'), c.remove);

module.exports = router;
