const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/createPlanFilm", async (req, res) => {
    const { Film } = res.app.locals.models;
    const { start, title, price, description } = req.body;
    try {
        const film = await Film.create({
            start: start,
            title: title,
            description: description,
            price: price
        })
        res.status(201).json(film);
    } catch (err) {
        console.log("err2", err)
        res.status(500).send
    }

});

module.exports = router;