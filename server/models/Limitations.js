const mongoose = require('mongoose')


const LimitationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    current: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    kind: {
        type: String,
        required: true,
    },
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    }
});

const LimitationModel = mongoose.model("limitations", LimitationSchema);
module.exports = LimitationModel;