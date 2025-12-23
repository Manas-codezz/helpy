const authorization = (...roles)=>{
    return ( req,res ,next)=> {

    try {
       
        if(!roles.includes(req.userRole)){
             return res.status(403).json({ msg: "Access is denied !!! You  are  Not authorized"})
        }
  next();
    } catch (error) {
            console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" , error});
    }
 }

};

module.exports = authorization;