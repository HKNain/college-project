import { verifyToken } from "../utils/jwtToken.js";

const  protectRoute = async ( req , res , next ) => {
    try {
        // Todo Add Headers Later 
        const token = req.cookies.token 
        if ( ! token ) {
            return res.status(401).json({ message: "Unauthorized access - no token provided" });
        }
        const decoded = verifyToken(token);
        if ( ! decoded ) {
            return res.status(401).json({ message: "Unauthorized access - invalid token" });
        }
        req.user = decoded ;

        next() ;
        
    } catch (error) {
        console.log ( " error in protectRoute " , error )
        return  res.status(500).json({ message: "Internal server error" });

    }
}

export default protectRoute