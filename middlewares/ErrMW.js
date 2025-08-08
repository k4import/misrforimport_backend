module.exports= (err,req,res,nxt)=>{
    for (let e in err.errors) {
        console.log(err.errors[e].message)
        res.status(500).send("Internal server error..")
    }
}
