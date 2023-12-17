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
        res.status(403).send
    }
}

router.post("/createPlanFilm", verifyToken, async (req, res) => {
    const { Film } = res.app.locals.models;
    let { start, title, price, description, ticket, discoutActive } = req.body;
    try {
        const existingFilm = await Film.findOne({ where: { start } });
        if (existingFilm) {
            return res.status(400).json({ error: 'È già presente un film con la stessa data' });
        } else {
            const date = new Date(start); 
            if (discoutActive === true) {
                if (date.getDay() === 1) {
                    price = price * 0.8;
                } else if (date.getDay() === 2) {
                    price = price * 0.6;
                } else { date.getHours() > 17 && date.getDay() === 0 ? price = price * 1.2 : price = price * 0.9; }
            }
            const film = await Film.create({ start, title, price, description, ticket, discoutActive });
            res.json(film);
        }

    } catch (error) {
        console.log("err2", error)
        res.status(400).json({ error: 'Impossibile registrare il film' });
    }
});

router.post("/removeTicket/:id", verifyToken, async (req, res) => {
    const { Film } = res.app.locals.models;
    const { ticket, id } = req.body;
    try {
        const film = await Film.findByPk(id);
        const newTicket = film.ticket - ticket;
        const updateTicket = await Film.update({ ticket: newTicket }, { where: { id: id } });
        const newIncome = film.price + film.income;
        const updateIncome = await Film.update({ income: newIncome }, { where: { id: id } });
        res.status(201).json({ updateTicket, updateIncome });
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