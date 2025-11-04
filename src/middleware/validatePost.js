export function validatePost(req, res, next) {
  const {title, content} = req.body;

  if (!title) {
    const error = new Error('Please include a title');
    error.status = 400;
    return next(error);
  };

  if (!content) {
    const error = new Error("Please don't leave an empty post");
    error.status = 400;
    return next(error);
  }
  next();
}