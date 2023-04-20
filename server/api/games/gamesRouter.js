import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import readFileContent from '../util/readFileContent.js';
import writeFileContent from '../util/writeFileContent.js';

// export const YoloDataFilePath = path.join(__dirname, 'yolo_data.json');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const YoloDataFilePath = path.join(__dirname, 'db.json');
const router = express.Router();

// api endpoint for /api/games
router.get('/', async (req, res) => {
  // get all games
  const data = await readFileContent(YoloDataFilePath);
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const data = await readFileContent(YoloDataFilePath);
  const temp = data.filter((game) => game.id !== id);
  const success = true;

  // remove game from games & update json file
  writeFileContent(YoloDataFilePath, temp)
    .then(() => {
      res.json({ success });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// post
router.post('/', async (req, res) => {
  const editedGame = req.body;
  let temp;
  const data = await readFileContent(YoloDataFilePath);
  // a new game, add id & push to games.
  if (!editedGame.id) {
    const newId = uuidv4();
    editedGame.id = newId;
    temp = [editedGame, ...data];
  } else {
    // already existing game, update it.
    temp = data.map((game) => {
      if (game.id === editedGame.id) {
        return editedGame;
      }
      return game;
    });
  }

  // remove game from games & update json file
  writeFileContent(YoloDataFilePath, temp)
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

export default router;
