var express = require('express');
var router = express.Router();

const films = [
  {
    id: 1,
    title: 'Star Wars: The Phantom Menace (Episode I)',
    duration: 136,
    budget: '115',
    link: 'https://en.wikipedia.org/wiki/Star_Wars:_Episode_I_%E2%80%93_The_Phantom_Menace',
  },
  {
    id: 2,
    title: 'Star Wars: Episode II – Attack of the Clones',
    duration: 142,
    budget: 115,
    link: 'https://en.wikipedia.org/wiki/Star_Wars:_Episode_II_%E2%80%93_Attack_of_the_Clones',
  },
  {
    id: 3,
    title: "Zack Snyder's Justice League",
    duration: 242,
    budget: 70,
    link: 'https://en.wikipedia.org/wiki/Zack_Snyder%27s_Justice_League',
  },
];

// Read all the films
router.get('/', function (req, res) {
  return res.json(films);
});

router.get('/:id', (req, res) => {

const indexOfFilmFound = films.findIndex((film) => film.id == req.params.id);

if(indexOfFilmFound < 0) return res.sendStatus(404);

res.json(films[indexOfFilmFound]);
});

router.get('/', (req, res, next) => {
  const orderByDuration =
    req?.query?.minimum-duration?.includes('duration') ? req.query['minimum-duration'] : undefined;
  let orderedFilms;
  console.log(`order by ${orderByDuration ?? 'not requested'}`);
  if (orderByDuration) orderedFilms = [...films].sort((a, b) => a.duration.localeCompare(b.duration));
  if (orderByDuration === '-duration') orderedFilms = orderedFilms.reverse();

  console.log('GET /films');
  return res.json(orderedFilms ?? films);
});

router.post('/', (req, res) => {
  const title = req?.body?.title?.length !== 0 ? req.body.title : undefined;
  const duration = req?.body?.duration?.length !== 0 ? req.body.duration : undefined;
  const budget = req?.body?.budget?.length !== 0 ? req.body.budget : undefined;
  const link = req?.body?.link?.length !== 0 ? req.body.link : undefined;

  if(!title || !duration || !budget || !link) return res.sendStatus(400);

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

  res.json(newFilm);
});

module.exports = router;