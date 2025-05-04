export function validatePost(req, res, next) {
    const { title, image, category_id, description, content, status_id } = req.body;
    if(!title) {return res.status(400).json({error:"title is required"})}
    if(!image) {return res.status(400).json({error:"image is required"})}
    if(!category_id) {return res.status(400).json({error:"category_id is required"})}
    if(!description) {return res.status(400).json({error:"description is required"})}
    if(!content) {return res.status(400).json({error:"content is required"})}
    if(!status_id) {return res.status(400).json({error:"status_id is required"})}

    if (typeof title !== "string"){return res.status(400).json({error:"title must be a string"})}
    if (typeof image !== "string"){return res.status(400).json({error:"image must be a string"})}
    if (typeof description !== "string"){return res.status(400).json({error:"description must be a string"})}
    if (typeof content !== "string"){return res.status(400).json({error:"content must be a string"})} 
    if (typeof category_id !== "number"){return res.status(400).json({error:"category_id must be a number"})}
    if (typeof status_id !== "number"){return res.status(400).json({error:"status_id must be a number"})} 

    next();
  }
  