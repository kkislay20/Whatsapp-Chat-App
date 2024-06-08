import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;

    if(!token) {
        return res.status(401).json({
            message: "Unatuhorized: Token not provided"
        });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        next();
    }catch(error) {
        return res.status(401).json({
            message: "Unatuhorized: Invalid Token"
        });
        console.log(error.message);
    }
}

export default verifyToken;