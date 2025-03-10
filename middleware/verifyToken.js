const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.verifyToken = (req, res, next) => {
    const Authorization = req.header('Authorization');
    if (!Authorization) res.json({
        messenger: "Bạn chưa đăng nhập"
    })
    const token = Authorization.replace('Bearer ', '');
    try {
        const { userID } = jwt.verify(token, process.env.APP_SECERT || '123456');
        req.user = { userID };
        next();
    } catch (err) {
        return res.status(401).json({
            messenger: "Token không hợp lệ"
        });
    }
}