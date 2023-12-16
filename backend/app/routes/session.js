const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


router.post("/register-user", async (req, res) => {
  const { User } = res.app.locals.models;
  const { mail, password, name, surname } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ mail, password: hashedPassword, name, surname });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Impossibile registrare l\'utente' });
  }
});

router.post("/register-admin", async (req, res) => {
  const { Admin } = res.app.locals.models;
  const { firstName, lastName, mail, password, level } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ firstName, lastName, mail, password: hashedPassword, level });
    res.json(admin);
  } catch (error) {
    res.status(400).json({ error: 'Impossibile registrare l\'utente' });
  }
});

router.post('/login', async (req, res) => {
  const { User, Admin } = res.app.locals.models;
  const { mail, password } = req.body;
  try {
    const user = await User.findOne({ where: { mail } });
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        const token = jwt.sign({ mail: user.mail }, process.env.TOKEN_KEY, 
          {
            expiresIn: "30d",
        });
        res.json({ token });
      } else {
        res.status(401).json({ error: 'Credenziali non valide' });
      }
    } else {
      const admin = await Admin.findOne({ where: { mail } });
      if (admin) {
        const validPassword = await bcrypt.compare(password, admin.password);
        if (validPassword) {
          const token = jwt.sign({ mail: admin.mail }, process.env.TOKEN_KEY, {
            expiresIn: "30d",
        });
          res.json({ token, level: admin.level  });
        } else {
          res.status(401).json({ error: 'Credenziali non valide' });
        }
      } else {
        res.status(401).json({ error: 'Credenziali non valide' });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Errore durante il login' });
  }
});

router.post('/login-admin', async (req, res) => {
  const { Admin } = res.app.locals.models;
  const { mail, password } = req.body;
  try {
    const admin = await Admin.findOne({ where: { mail } });
    if (admin) {
      const validPassword = await bcrypt.compare(password, admin.password);
      if (validPassword) {
        const token = jwt.sign({ mail: admin.mail }, process.env.TOKEN_KEY);
        res.json({ token });
      } else {
        res.status(401).json({ error: 'Credenziali non valide' });
      }
    } else {
      res.status(401).json({ error: 'Credenziali non valide' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Errore durante il login' });
  }
});

module.exports = router;