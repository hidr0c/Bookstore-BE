const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
    code: { type: String, require: true },
    discount: { type: Number, require: true, default: 0 },
    type: { type: String, require: true },
    expirationDate: { type: Date, required: true } // Thêm trường expirationDate
}, { timestamps: true })

const Code = mongoose.model('code', codeSchema);

module.exports = Code;