const validator = require("../learen_in_iti_course/UserValidation")

module.exports = (req, res, nxt) => {
    let valid = validator(req.body)
    if(valid){
        req.valid = 1
        nxt()
    }
    else{
        res.status(403).send("forbidden command")
    }
}