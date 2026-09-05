const mongoose = require('mongoose');

const knowledgeArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter article title'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Please enter article content'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    categoryName: {
      type: String,
      default: 'General Hardware',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    authorName: {
      type: String,
      default: 'Ecosystem Staff',
    },
    tags: [String],
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Search index on title and content
knowledgeArticleSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('KnowledgeArticle', knowledgeArticleSchema);
