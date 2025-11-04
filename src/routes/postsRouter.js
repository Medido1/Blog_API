import {Router} from 'express';
import { validatePost } from '../middleware/validatePost.js';
import {
  getPosts, getPostById,
  submitPost, updatePost,
  deletePost} 
from '../controllers/postsControllers.js';

const postsRouter = Router();

postsRouter.get('/', getPosts);
postsRouter.get('/:id', getPostById);
postsRouter.post('/', validatePost, submitPost);
postsRouter.put('/:id', validatePost, updatePost);
postsRouter.delete('/:id', deletePost);

export default postsRouter;