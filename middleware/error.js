const logger = require("../startup/logger")

module.exports=function(err,req,res,next){
    //logging
    logger.error(err.message)
    
    res.status(500).send("hata olustu")
}