import {Router} from 'express';
import { validatePost } from '../middleware/validatePost.js';
import {
  getPosts, getPostById,
  submitPost, updatePost,
  deletePost} 
from '../controllers/postsControllers.js';

const postsRouter = Router();

postsRouter.get('/posts', getPosts);
postsRouter.get('/posts/:id', getPostById);
postsRouter.post('/posts', validatePost, submitPost);
postsRouter.put('/posts/:id', validatePost, updatePost);
postsRouter.delete('/posts/:id', deletePost);

export default postsRouter;