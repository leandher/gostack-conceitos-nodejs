const express = require('express');
const cors = require('cors');

const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const repository = { ...request.body, id: uuid(), likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const {
    params: { id },
    body,
  } = request;

  const repository = repositories.find((repo) => repo.id === id);

  if (!repository)
    return response.status(400).send('Could not find this repository.');

  const { url, title, techs } = body;

  Object.assign(repository, { url, title, techs });

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const {
    params: { id },
    body,
  } = request;

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex === -1) return response.status(400).send();

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const {
    params: { id },
    body,
  } = request;

  const repository = repositories.find((repo) => repo.id === id);

  if (!repository)
    return response.status(400).send('Could not find this repository.');

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
