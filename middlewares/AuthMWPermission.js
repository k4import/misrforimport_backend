
const jwt = require("jsonwebtoken")
const config = require("config")

module.exports = (req,res,nxt)=>{
    //check user role (Admin or not)
    const token = req.header("x-auth-token")

    if(!token)return res.status(401).send("Access Denied..")

    try{
        const decodedPayload = jwt.verify(token,config.get("server.jwtsec"))

        if (!decodedPayload.adminRole) return res.status(401).send("Access Denied..")
            nxt()
    }
    catch(err){
        return res.status(400).send("invalid Token ..")
    }
}