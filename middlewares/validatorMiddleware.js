const {validationResult} = require('express-validator');

const validatorMiddleware = (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "fail",
            errors: errors.array()
        });
    }
    next()
    // if no error continue to the next middleware
}

module.exports = validatorMiddleware