import jsonwebtoken from "jsonwebtoken";


const generateToken = (payload) => {
    // TODO add additional things 
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET);
}
const verifyToken = (token) => {
    try {
        return jsonwebtoken.verify(token, process.env.JWT_SECRET);  
    } catch (error) {
        return null;
    }
}

export { generateToken, verifyToken };