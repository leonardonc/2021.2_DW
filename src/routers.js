import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Host from './models/Host.js';
import User from './models/User.js';
import Auth from './middlewares/auth.js';

const router = express.Router();

router.get('/hosts', Auth.isAuthenticated, async (req, res) => {
  const hosts = await Host.readAll();

  res.json(hosts);
});

router.post('/hosts', Auth.isAuthenticated, async (req, res) => {
  const data = req.body;

  const host = await Host.create(data);

  res.json(host);
});

router.delete('/hosts/:id', Auth.isAuthenticated, async (req, res) => {
  const { id } = req.params;

  if (await Host.destroy(id)) {
    res.status(204).send();
  } else {
    throw new Error(`Can't destory Host`);
  };
});

router.post('/signup', async (req, res) => {
  const user = req.body;

  const newUser = await User.create(user);

  res.json(newUser);
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { id: userId, password: hash } = await User.readByEmail(email);

    const match = await bcrypt.compare(password, hash);

    if (match) {
      const token = jwt.sign({ userId }, process.env.SECRET, {
        expiresIn: 600 // 10min
      });

      res.json({ auth: true, token });
    }  else {
      throw new Error();
    }
  } catch (error) {
    res.status(401).json({ error: "User not found" });
  }
});

router.use((req, res, next) => {
  res.status(404).json({ error: "Sorry can't find that!" });
});

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

export default router;