const { Schema, model } = require('mongoose');
const Participant = require('./Participant');

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    datef: {
        type: Date,
        required: true
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'Participant'
    }],
    isActive: {
        type: Boolean,
        default: true // Puedes establecer el valor predeterminado según sea necesario
    }
}, {
    timestamps: true
});

module.exports = model('Event', eventSchema);