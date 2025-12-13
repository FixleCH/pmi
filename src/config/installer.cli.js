export const config = {
  requireSudo: true,
  defaultNodeVersion: '18',
  dockerfileTemplate: `
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["node"]
  `
};
