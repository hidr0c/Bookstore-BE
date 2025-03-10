const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

exports.register = async (req, res, next) => {
    try {
        const email = await User.find({ email: req.body.email });
        if (email.length !== 0) {
            res.json({
                status: "failed",
                messenger: "Email đã có người sử dụng"
            });
            res.end();
        }
        const newUser = new User({ ...req.body });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);

        const savedUser = await newUser.save();
        const token = jwt.sign({ userID: savedUser._id }, process.env.APP_SECRET);
        res.json({
            status: "success",
            user: savedUser,
            token
        });
    } catch (err) {
        console.log("Err", err);
        res.status(500).json({
            status: "failed",
            messenger: "Đăng ký tài khoản thất bại"
        });
    }
}

exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
            .populate("cart.product");
        if (!user) {
            res.json({
                status: 'failed',
                messenger: 'Email không hợp lệ' 
            });
            return;
        }
        const isMatch = await bcrypt.compare(bcrypt.hash(req.body.password), user.password);
        if (!isMatch) {
            return res.json({
                status: "failed",
                messenger: "Sai email hoặc mật khẩu"
            });
        }
            const token = jwt.sign({ userID: user.id }, process.env.APP_SECERT);
            const subTotal = user.cart.reduce((total, cart) => {
                let price = cart.product.sale > 0 ? cart.product.price - (cart.product.sale / 100 * cart.product.price) : cart.product.price;
                return total + price * cart.quantity;
            }, 0);
            res.status(200).json({
                status: "success",
                token: token,
                user: {
                    _id: user._id,
                    cart: user.cart,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    phone: user.phone,
                    image: user.image,
                    address: user.address
                },
                subTotal
            })
    }
    catch (err) {
        console.log("Err", err)
    }
}

exports.getCurrentUser = async (req, res, next) => {
    try {
        const { userID } = req.user;
        if (userID) {
            const user = await User.findById(userID)
                .populate("cart.product");
            const subTotal = user.cart.reduce((total, cart) => {
                let price = cart.product.sale > 0 ? cart.product.price - (cart.product.sale / 100 * cart.product.price) : cart.product.price;
                return total + price * cart.quantity;
            }, 0);
            res.status(200).json({
                status: 'success',
                user,
                subTotal
            })
        }
    }
    catch (err) {
    }
}

exports.loginAdmin = async (req, res, next) => {
    try {
        const { password, email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            res.json({
                status: 'failed',
                messenger: "Không tìm thấy email"
            })
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({
                status: "failed",
                messenger: "Sai tài khoản hoặc mật khẩu"
            });
        }

        if (user.role === 'admin') {
            const token = jwt.sign({ userID: user.id }, process.env.APP_SECERT);
            res.status(200).json({
                status: "success",
                token: token,
                user: {
                    id: user._id,
                    cart: user.cart,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    phone: user.phone,
                    address: user.address,
                    image: user.image
                }
            });
        } else {
            res.json({
                status: "failed",
                messenger: "Bạn không có quyền truy cập"
            });
        }
    } catch (err) {
        console.log("Err", err);
        res.status(500).json({
            status: "failed",
            messenger: "Đăng nhập thất bại"
        });
    }
}