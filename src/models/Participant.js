//Participant.js
const { Schema, model } = require('mongoose');

const participantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String 
    }
}, {
    timestamps: true
});

module.exports = model('Participant', participantSchema);