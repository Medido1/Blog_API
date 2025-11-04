import {Router} from 'express';

const postsRouter = Router();

let posts = [
  {id: 1, title: "post1", content: "hello world"},
  {id: 2, title: "post2", content: "Goobye cruel world"}
];

postsRouter.get('/posts', (req, res, next) => {
  try {
    if (!posts) {
      const error = new Error('Posts data not available');
      error.status = 500;
      throw(error)
    }

    if (posts.length === 0) {
      const error = new Error('No posts found');
      error.status = 404;
      throw error
    }

    res.json(posts);
  } catch (error) {
    next(error)
  }
});

postsRouter.get('/posts/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const targetPost = posts.find(post => post.id === id);

  if (!targetPost) {
    const error = new Error(`There is no post with the id: ${id}`);
    error.status = 404;
    return next(error); // pass to global error handler
  }

  return res.status(200).json(targetPost)
});

postsRouter.post('/posts', (req, res, next) => {
  try {
    const newPost = {
      id: posts.length + 1,
      title: req.body.title,
      content: req.body.content
    };
  
    if (!newPost.title) {
      const error = new Error('Please include a title');
      error.status = 400;
      throw error
    };
    if (!newPost.content) {
      const error = new Error("Please don't leave an empty post");
      error.status = 400;
      throw error
    }
    posts.push(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    next(error)
  }
});

export default postsRouter;