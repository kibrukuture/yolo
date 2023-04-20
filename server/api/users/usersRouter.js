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

// api endpoint for /api/users
router.get('/', async (req, res) => {
  // get all users
  const data = await readFileContent(YoloDataFilePath);
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const data = await readFileContent(YoloDataFilePath);
  const temp = data.filter((user) => user.id !== id);

  // remove game from games & update json file
  writeFileContent(YoloDataFilePath, temp)
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// post (adds a new one or updates)
router.post('/', async (req, res) => {
  const data = await readFileContent(YoloDataFilePath);
  const editedUser = req.body;
  let temp;
  // a new user, add id & push to users.
  if (!editedUser.id) {
    const newId = uuidv4();
    editedUser.id = newId;
    temp = [editedUser, ...data];
  } else {
    // user already exists, update it.
    temp = data.map((user) => {
      if (user.id === editedUser.id) {
        return editedUser;
      }
      return user;
    });
  }

  // remove a user from users & update json file
  writeFileContent(YoloDataFilePath, temp)
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});
export default router;
