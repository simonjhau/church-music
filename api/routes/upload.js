import express from 'express';
const router = express.Router();

import multer from 'multer';
const upload = multer({ dest: 'upload/' });

import fs from 'fs';
import util from 'util';
const unlinkFile = util.promisify(fs.unlink);

import { uploadFile, getFile, getListOfFiles } from '../middleware/s3.js';

// Get all game data
// router.post('/', (req, res) => {
//   console.log('received!');
//   res.json('Songs');
// });

router.post('/', upload.single('image'), async (req, res) => {
  const file = req.file;
  console.log(file);
  const result = await uploadFile(file);
  await unlinkFile(file.path);
  console.log(result);
  const description = req.body.description;
  res.send({ imagePath: `/upload/${result.Key}` });
});

router.get('/', (req, res) => {
  console.log('here');
  const readStream = getFile('music/This Is My Body Music LD 627.pdf');
  readStream.pipe(res);
});

router.get('/list', (req, res) => {
  const readStream = getListOfFiles();
  readStream.pipe(res);
});

// // Create new game
// router.post("/", (req, res) => {
//   newGameId = makeId(5);

//   const newGame = {
//     id: newGameId,
//     ip1: req.ip,
//     ip2: null,
//     history: [{ squares: Array(9).fill(null) }],
//     moveNum: 0,
//     timeLastUpdate: new Date().getTime(),
//   };

//   games.push(newGame);
//   res.json({ msg: "New game created", game: games[games.length - 1] });
// });

// // 2nd player join game
// router.patch("/:id", (req, res) => {
//   const found = games.some(idFilter(req));
//   if (found) {
//     games.forEach((game, i) => {
//       if (idFilter(req)(game)) {
//         game.ip2 = req.ip;
//         game.timeLastUpdate = new Date().getTime();
//         res.json({ msg: "Game updated", game });
//       }
//     });
//   } else {
//     res.status(400).json({ msg: `No game exists with id of ${req.params.id}` });
//   }
// });

// // Get game data by ID
// router.get("/:id", (req, res) => {
//   const found = games.some(idFilter(req));
//   if (found) {
//     res.json(games.find(idFilter(req)));
//   } else {
//     res.status(400).json({ msg: `No game exists with id of ${req.params.id}` });
//   }
// });

// // Update state of game
// router.put("/:id", (req, res) => {
//   const found = games.some(idFilter(req));
//   if (found) {
//     games.forEach((game, i) => {
//       if (idFilter(req)(game)) {
//         // Check that device has permission to play this game
//         if (req.ip === game.ip1 || req.ip === game.ip2) {
//           // Update game
//           game.history.push({ squares: req.body.squares });
//           game.moveNum += 1;
//           game.timeLastUpdate = new Date().getTime();

//           res.json({ msg: "Game updated", game: game });
//         }
//       }
//     });
//   } else {
//     res.status(400).json({ msg: `No game exists with id of ${req.params.id}` });
//   }
// });

// // Delete Member
// router.delete("/:id", (req, res) => {
//   const found = games.some(idFilter(req));

//   if (found) {
//     // Delete game
//     games.forEach((game, i) => {
//       if (idFilter(req)(game)) {
//         games.splice(i, 1);
//       }
//     });
//     res.json({
//       msg: `Game ${req.params.id}  deleted`,
//     });
//   } else {
//     res.status(400).json({ msg: `No game exists with id of ${req.params.id}` });
//   }
// });

// // Delete games that have not been updated for over 10 minutes
// const ONE_MINUTE = 60 * 1000;
// const TEN_MINUTES = 10 * ONE_MINUTE;
// setInterval(() => {
//   games.forEach((game, i) => {
//     const curTime = new Date().getTime();
//     if (curTime - game.timeLastUpdate > TEN_MINUTES) {
//       // Delete that record from array
//       console.log(`Game ${game.id} deleted`);
//       games.splice(i, 1);
//     }
//   });
// }, ONE_MINUTE);

// // Make unique ID for game
// function makeId(length) {
//   const result = [];
//   let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//   for (let i = 0; i < length; i++) {
//     result.push(
//       characters.charAt(Math.floor(Math.random() * characters.length))
//     );
//   }
//   let id = result.join("");

//   // Check that ID is unique
//   if (games.find((game) => game.id === id)) {
//     id = makeId(length);
//   }

//   return id;
// }

export default router;
