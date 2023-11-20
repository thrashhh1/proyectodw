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
     renderEventid,
     addVotetoParticipant,
     updateEventStatus
} = require("../controllers/events.controller");

const { isAuthenticated } = require("../helpers/auth");
const Participant = require("../models/Participant");


// Ver evento
router.get("/eventos/:id/", renderEventid);

// Nuevo evento
router.get("/events/crear", isAuthenticated, renderEventsForm); //esta ruta envia al archivo new-event.hbs
router.post("/eventos/crear", isAuthenticated, createNewEvent);

//Obtener todos los eventos
router.get("/eventos", renderEvents);
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

//Dar voto a participante
router.post("/events/participant/addVote/", addVotetoParticipant);

router.post("/events/actualizarEstado/:id", updateEventStatus);

module.exports = router;
