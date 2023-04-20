import { promises as fs } from 'fs';
const readFileContent = async (path) => JSON.parse(await fs.readFile(path, 'utf8'));
export default readFileContent;
