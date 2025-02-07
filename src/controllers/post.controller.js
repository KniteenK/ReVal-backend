import Post from '../models/post.model.js';
import User from '../models/user.model.js';

/**
 * @desc Create a new post
 * @route POST /api/posts
 * @access Private
 */
export const createPost = async (req, res) => {
    try {
        const { content, images } = req.body;
        const userId = req.user._id;

        const newPost = new Post({
            user: userId,
            content,
            images
        });

        await newPost.save();
        res.status(201).json({ success: true, message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * @desc Get all posts
 * @route GET /api/posts
 * @access Public
 */
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'username email')
            .sort({ timestamp: -1 });

        res.status(200).json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * @desc Get a single post by ID
 * @route GET /api/posts/:id
 * @access Public
 */
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('user', 'username email');
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        res.status(200).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * @desc Like or unlike a post
 * @route POST /api/posts/:id/like
 * @access Private
 */
export const toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        const userId = req.user._id;
        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        } else {
            post.likes.push(userId);
        }

        await post.save();
        res.status(200).json({ success: true, message: hasLiked ? 'Like removed' : 'Post liked', likes: post.likes.length });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * @desc Comment on a post
 * @route POST /api/posts/:id/comment
 * @access Private
 */
export const addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        const { content } = req.body;
        const newComment = { user: req.user._id, content, timestamp: new Date() };

        post.comments.push(newComment);
        await post.save();

        res.status(200).json({ success: true, message: 'Comment added', comments: post.comments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * @desc Delete a post
 * @route DELETE /api/posts/:id
 * @access Private
 */
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        // Check if user is owner of the post
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        await post.deleteOne();
        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
