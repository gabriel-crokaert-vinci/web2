const express = require('express');
const {parse, serialize} = require('../utils/json')
var router = express.Router();

const jsonDbPath = __dirname + '/../data/films.json'


router.get('/:id', (req, res) => {
const films = parse(jsonDbPath, affiches);

const indexOfFilmFound = films.findIndex((film) => film.id == req.params.id);

if(indexOfFilmFound < 0) return res.sendStatus(404);

res.json(films[indexOfFilmFound]);
});

router.get('/', (req, res, next) => {
  const films = parse(jsonDbPath, affiches);
  const filterByDuration = req?.query?.['minimum-duration'] ? parseInt(req.query['minimum-duration']) : undefined;

  let filteredFilms;
  console.log(`order by ${filterByDuration ?? 'not requested'}`);

  if (isNaN(filterByDuration)){
    return res.status(400).json({ error: 'Invalid minimum'})
  }

  if(filterByDuration !== undefined){
    filteredFilms = films.filter(film => film.duration >= filterByDuration);
  }

  /*if (orderByDuration) {
    if (orderByDuration < 0) {
      orderedFilms = [...films].sort((b, a) => Math.abs(a['minimum-duration']) - Math.abs(b['minimum-duration']));
    } else {
      orderedFilms = [...films].sort((a, b) => Math.abs(a['minimum-duration']) - Math.abs(b['minimum-duration']));
    }
  }*/

  console.log('GET /films');
  return res.json(filteredFilms ?? films);

});

router.post('/', (req, res) => {
  const title = req?.body?.title?.length !== 0 ? req.body.title : undefined;
  const duration = req?.body?.duration?.length !== 0 ? req.body.duration : undefined;
  const budget = req?.body?.budget?.length !== 0 ? req.body.budget : undefined;
  const link = req?.body?.link?.length !== 0 ? req.body.link : undefined;

  if(!title || !duration || !budget || !link) return res.sendStatus(400);

  const films = parse(jsonDbPath, affiches);
  const lastIndex = films?.length !== 0 ? films.length - 1 : undefined;
  const lastId = lastIndex !== undefined ? films[lastIndex]?.id : 0;
  const nextId = lastId + 1;
  
  const newFilm = {
    id: nextId,
    title: title,
    duration: duration,
    budget: budget,
    link: link,
  }

  films.push(newFilm);

  serialize(jsonDbPath, films)

  res.json(newFilm);
});

module.exports = router;