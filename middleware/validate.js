export function validatePost(req, res, next) {
    const { title, image, category_id, description, content, status_id } = req.body;
    if (!title || !image || !category_id || !description || !content || !status_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    if (typeof title !== "string" || typeof image !== "string" || typeof description !== "string" || typeof content !== "string") {
      return res.status(400).json({ error: "Fields title, image, description, and content must be strings" });
    }
  
    if (typeof category_id !== "number" || typeof status_id !== "number") {
      return res.status(400).json({ error: "Fields category_id and status_id must be numbers" });
    }
  
    next();
  }