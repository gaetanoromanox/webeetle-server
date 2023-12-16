const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, process.env.TOKEN_KEY, (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                req.authData = authData;
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
}

router.post("/createPlanFilm", verifyToken, async (req, res) => {
    const { Film } = res.app.locals.models;
    const { start, title, price, description, ticket } = req.body;
    try {
        const film = await Film.create({ start, title, price, description, ticket });
        res.json(film);
    } catch (error) {
        console.log("err2", error)
        res.status(400).json({ error: 'Impossibile registrare l\'utente' });
    }
});

router.post("/removeTicket/:id", verifyToken, async (req, res) => {
    const { Film } = res.app.locals.models;
    const { ticket, id, income } = req.body;
    try {
        const film = await Film.findByPk(id);
        const newTicket = film.ticket - ticket;
        const updateTicket = await Film.update({ ticket: newTicket }, { where: { id: id } });
        const newIncome = film.income + income;
        const updateIncome = await Film.update({ income: newIncome }, { where: { id: id } });
        res.status(201).json(updateTicket, updateIncome);
    } catch (err) {
        console.log("err2", err)
        res.status(500).send
    }

});

router.get("/getFilm", verifyToken, async (req, res) => {
    const { Film } = res.app.locals.models;
    try {
        const film = await Film.findAll();
        res.status(201).json(film);
    } catch (err) {
        console.log("err2", err)
        res.status(500).send
    }
});

router.get("/getFilm/:id", verifyToken, async (req, res) => {
    const { Film } = res.app.locals.models;
    const { id } = req.params;
    try {
        const film = await Film.findByPk(id);
        res.status(201).json(film);
    } catch (err) {
        console.log("err2", err)
        res.status(500).send
    }
})




module.exports = router;