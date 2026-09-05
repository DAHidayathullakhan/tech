const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/kbController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', getArticles);
router.get('/:slug', getArticleBySlug);
router.post('/', protect, authorizeRoles('admin', 'support_staff'), createArticle);
router.put('/:id', protect, authorizeRoles('admin', 'support_staff'), updateArticle);
router.delete('/:id', protect, authorizeRoles('admin'), deleteArticle);

module.exports = router;
