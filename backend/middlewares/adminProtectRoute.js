import User from "../models/user.model.js"

export const adminProtectRoute =async  (req  , res , next ) => {
    try {
        const user =  await User.findOne(req.user.id) 
        console.log(user)
        if (user.role !=="Admin"){
            return  res.status(400).json({message : " Unauthorised Access" , flag : false })
        }
        next() ;
        
    } catch (error) {
        console.log ("error in adminProtectRoute" , error) ;
        return res.status(500).json({message : "Internal Server   Error " , flag : false })
    }
}