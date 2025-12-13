import fs from 'node:fs';
import path from 'node:path';

export async function dockerizeCommand() {
    const dockerfile = `
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["node"]
`;
    const filePath = path.join(process.cwd(), 'Dockerfile');
    fs.writeFileSync(filePath, dockerfile.trim());
    console.log('PMI: Dockerfile generated successfully.');
}
