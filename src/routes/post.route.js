import express from 'express';
import verifyUserJWT from '../middlewares/auth.middleware.js';
import {
    createPost,
    getAllPosts,
    getPostById,
    toggleLike,
    addComment,
    deletePost
} from '../controllers/post.controller.js';

const router = express.Router();

// Create a new post
router.post('/createPost', verifyUserJWT, createPost);

// Get all posts
router.get('/allPosts', getAllPosts);

// Get a single post by ID
router.get('/:id', getPostById);

// Like/unlike a post
router.post('/:id/like', verifyUserJWT, toggleLike);

// Comment on a post
router.post('/:id/comment', verifyUserJWT, addComment);

// Delete a post
router.delete('/:id', verifyUserJWT, deletePost);

export default router;
