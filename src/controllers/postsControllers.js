let posts = [
  {id: 1, title: "post1", content: "hello world"},
  {id: 2, title: "post2", content: "Goobye cruel world"}
];

export const getPosts = (req, res, next) => {
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
};

export const getPostById = (req, res, next) => {
  const id = parseInt(req.params.id);
  const targetPost = posts.find(post => post.id === id);

  if (!targetPost) {
    const error = new Error(`There is no post with the id: ${id}`);
    error.status = 404;
    return next(error); // pass to global error handler
  }
  return res.status(200).json(targetPost)
};

export const submitPost = (req, res, next) => {
  try {
    const newPost = {
      id: posts.length + 1,
      title: req.body.title,
      content: req.body.content
    };

    posts.push(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    next(error)
  }
};

export const updatePost = (req, res, next) => {
  const id = parseInt(req.params.id);
  const targetPost = posts.find(post => post.id === id);

  if (!targetPost) {
    const error  = new Error(`a post with the id of ${id} not found`);
    error.status = 404;
    return next(error);
  };

  targetPost.title = req.body.title;
  targetPost.content = req.body.content;
  res.status(202).json(targetPost);
};

export const deletePost = (req, res, next) => {
  const id = parseInt(req.params.id);
  const targetPost = posts.find(post => post.id === id);

  if (!targetPost) {
    const error  = new Error(`a post with the id of ${id} not found`);
    error.status = 404;
    return next(error);
  };

  posts = posts.filter(post => post.id !== id);
  res.status(200).json({ message: `Post ${id} deleted`, posts });
};