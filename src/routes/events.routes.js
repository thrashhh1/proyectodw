const { Router } = require("express");
const router = Router();

const {
     renderEventsForm,
     createNewEvent,
     renderEvents,
     renderEditForm,
     updateEvent,
     deleteEvent,
     renderAdminevents,
     renderAdminParticipant,
     AddParticipant,
     deleteParticipant,
     renderEventid
} = require("../controllers/events.controller");

const { isAuthenticated } = require("../helpers/auth");
const Participant = require("../models/Participant");


// Ver evento
router.get("/events/event/:id", renderEventid);

// Nuevo evento
router.get("/events/add", isAuthenticated, renderEventsForm); //esta ruta envia al archivo new-event.hbs
router.post("/events/new-event", isAuthenticated, createNewEvent);

//Obtener todos los eventos
router.get("/events", renderEvents);
router.get("/events/administration", isAuthenticated, renderAdminevents);

// Editar eventos
router.get("/events/edit/:id", isAuthenticated, renderEditForm);
router.put("/events/edit/:id", isAuthenticated, updateEvent);

//Eliminar eventos
router.delete("/events/delete/:id", isAuthenticated, deleteEvent);

//Añadir participantes
router.get("/events/admin-participant",isAuthenticated, renderAdminParticipant);
router.post("/events/new-participant",isAuthenticated, AddParticipant);

//Eliminar participantes
router.delete("/events/participant/delete/:id",isAuthenticated ,deleteParticipant);

module.exports = router;
