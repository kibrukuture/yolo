import { promises as fs } from 'fs';

const writeFileContent = async (path, data) => {
  try {
    await fs.writeFile(path, JSON.stringify(data));
  } catch (err) {
    throw err;
  }
};

export default writeFileContent;
