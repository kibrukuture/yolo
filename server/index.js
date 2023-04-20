import express from 'express';
import cors from 'cors';
import gamesRouter from './api/games/gamesRouter.js';
import usersRouter from './api/users/usersRouter.js';
import filterRouter from './filterRouter.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/games', gamesRouter);
app.use('/api/users', usersRouter);
app.use('/api/filter', filterRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app;
