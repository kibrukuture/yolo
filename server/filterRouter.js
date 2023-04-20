import express from 'express';
import gameData from './api/games/db.json' assert { type: 'json' };
import userData from './api/users/db.json' assert { type: 'json' };

const router = express.Router();

// api endpoint for /api/users
router.get('/', (req, res) => {
  const { term, sdt, edt, route, option } = req.query;

  let data = route === 'games' ? gameData : route === 'users' ? userData : [];

  let temp;
  if (term && route === 'users') {
    temp = filterUser(option, term, data);
  } else if (term && route === 'games') {
    temp = filterGame(option, term, data, sdt, edt);
  }

  res.json(temp);
});

export default router;

// check date

function isDateBetween(startDate, endDate, checkDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const check = new Date(checkDate);

  return check >= start && check <= end;
}

function filterUser(option, term, data) {
  const fn = (oflag) => {
    // oflag: option flag
    return data.filter((item) => {
      if (oflag !== 'address') {
        const exists = item[oflag].toLowerCase().includes(term.toLowerCase());
        if (exists) {
          return item;
        }
      } else {
        const exists = `${item.address.street} ${item.address.city} ${item.address.country}`.toLowerCase().includes(term.toLowerCase().replace(',', '').trim().split(' ').join(' '));
        if (exists) {
          return item;
        }
      }
    });
  };
  switch (option) {
    case 'Name':
      return fn('name');
    case 'Location':
      return fn('address');
    case 'Country':
      return fn('address');
    case 'Email':
      return fn('email');
    default:
      return [];
  }
}
function filterGame(option, term, data, sdt, edt) {
  const fn = (oflag) => {
    // oflag: option flag
    let temp = data.filter((item) => {
      const exists = item[oflag].toLowerCase().includes(term.toLowerCase());
      return exists;
    });
    const pattern = /^\d{4}-\d{2}-\d{2}$/; // date pattern: yyyy-mm-dd
    if (pattern.test(sdt) && pattern.test(edt)) {
      temp = temp.filter((item) => {
        const exists = isDateBetween(sdt, edt, item.at);
        return exists;
      });
    }
    return temp;
  };
  switch (option) {
    case 'Name':
      return fn('name');
    case 'Category':
      return fn('cat');
    case 'Publisher':
      return fn('pub');
    case 'Release Date':
      return fn('at');
    default:
      return [];
  }
}
