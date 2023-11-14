const eventsCtrl = {};

const Event = require('../models/Event');
const Participant = require('../models/Participant');

//Funciones para eventos
eventsCtrl.renderEventsForm = async (req, res) =>{
    const participants = await Participant.find().lean();
    res.render('events/administration/new-event',{
        title: 'Eventos',
        style: 'add.css', participants
    })
};

eventsCtrl.createNewEvent = async (req, res) =>{
    const {title, date, datef, participants} = req.body;
    const newEvent = new Event({title, date, datef, participants});
    await newEvent.save();
    console.log(newEvent);
    res.redirect('/events/administration');
};

eventsCtrl.renderEvents = async (req, res) =>{
    const events = await Event.find().lean();
    const style = 'all-events.css';
    res.render('events/all-events', { events, style});
};

eventsCtrl.renderAdminevents = async (req,res) =>{
    const events = await Event.find().lean();
    const style = 'all-events.css';
    res.render('events/administration/adminevent', {events, style});
};

eventsCtrl.renderEditForm = (req, res) => {
    res.send('Render EditForm')
};

eventsCtrl.updateEvent = (req, res) => {
    res.send('update event')
};

eventsCtrl.deleteEvent = async (req, res) => {
    await Event.findByIdAndDelete(req.params.id);
    res.redirect('/events/administration');
};

//Funciones para participantes

eventsCtrl.renderAdminParticipant = async (req, res) => {
    const participants = await Participant.find().lean();
    res.render('events/administration/admin-participant', {
        style: 'admin-participant.css', participants
    });
};

eventsCtrl.AddParticipant = async (req, res) =>{
    const {name, votes, imageUrl} = req.body;
    const newParticipant = new Participant({name, votes, imageUrl});
    await newParticipant.save();
    console.log(newParticipant);
    res.redirect('/events/admin-participant');
};

eventsCtrl.deleteParticipant = async (req, res) => {
    await Participant.findByIdAndDelete(req.params.id);
    res.redirect('/events/admin-participant');
};

// Vista de evento
eventsCtrl.renderEventid = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId).populate('participants').lean();

        if (!event) {
            return res.status(404).send('Evento no encontrado');
        }

        res.render('events/event', { event, style: 'signin.css' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los detalles del evento');
    }
};



module.exports = eventsCtrl; 