import express from 'express';
import bodyParser from 'body-parser';
import Blockchain, { Block, Transaction } from './blockchain/index.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// import Router from './router/index.js';
// import { HTTP_PORT } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

const bc = new Blockchain();
//const router = new Router(bc);
const tx = new Transaction();


//console.log(block.prevHash);
//console.log(block);


app.get('/blocks', (req, res) => {
  const r = bc.chain.map((b, i) => {
    const j = b.toJSON();
    j.hash = b.hash();
    j.height = i;
    return j;
  });
  res.json(r.reverse());
});


app.post('/transact', (req, res) => {
  const { msg } = req.body;
  tx.signTransaction(tx.privateKey, String(msg));

  let transactions = [tx.id, tx.outputs, tx.input];
  console.log(transactions);
  const prevHash = bc.lastHash();
  let timestamp = new Date().getTime();
  let block = new Block(timestamp, prevHash, transactions, msg);
  bc.addBlock(block);
  console.log(bc.chain);


  res.json({ publicKey: tx.publicKey, msg});
  //res.redirect('/transactions');
});

app.listen(port, () => console.log(`Listening on port ${port}`));