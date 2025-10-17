import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    let token = req.headers.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: 'Token invalid or expired' });
    }
}

export default authUser