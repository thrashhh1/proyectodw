const { Schema, model } = require('mongoose');

const participantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        default: 0
    },
    imageUrl: {
        type: String 
    }
}, {
    timestamps: true
});

module.exports = model('Participant', participantSchema);
