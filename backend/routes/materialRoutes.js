const router = require('express').Router();
const c = require('../controllers/materialController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Both roles can view
router.get('/', protect, c.list);
// Only teachers can upload / delete
router.post('/', protect, authorize('teacher'), c.create);
router.delete('/:id', protect, authorize('teacher'), c.remove);

module.exports = router;
