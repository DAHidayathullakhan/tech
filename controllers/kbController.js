const KnowledgeArticle = require('../models/KnowledgeArticle');

// @desc    Get Knowledge Base articles (with search & category filter)
// @route   GET /api/kb
// @access  Public
exports.getArticles = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    let query = { isPublished: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.categoryName = category;
    }

    const startIndex = (page - 1) * limit;
    const total = await KnowledgeArticle.countDocuments(query);
    const articles = await KnowledgeArticle.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: articles.length,
      total,
      articles,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single article by slug
// @route   GET /api/kb/:slug
// @access  Public
exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await KnowledgeArticle.findOne({ slug: req.params.slug });
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Increment view count
    article.views += 1;
    await article.save();

    res.status(200).json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new Knowledge Base article
// @route   POST /api/kb
// @access  Private (Admin / Staff)
exports.createArticle = async (req, res) => {
  try {
    const { title, content, categoryName, tags } = req.body;
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();

    const article = await KnowledgeArticle.create({
      title,
      slug,
      content,
      categoryName: categoryName || 'General Maintenance',
      author: req.user.id,
      authorName: req.user.name,
      tags: tags || [],
    });

    res.status(201).json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update article
// @route   PUT /api/kb/:id
// @access  Private (Admin / Staff)
exports.updateArticle = async (req, res) => {
  try {
    const article = await KnowledgeArticle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.status(200).json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete article
// @route   DELETE /api/kb/:id
// @access  Private (Admin)
exports.deleteArticle = async (req, res) => {
  try {
    const article = await KnowledgeArticle.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    res.status(200).json({ success: true, message: 'Article removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
