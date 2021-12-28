import * as dotenv from "dotenv";
import express from 'express';
import morgan from 'morgan';
import 'express-async-errors';

import router from './routers.js';

dotenv.config();

const app = express();

app.use(morgan('tiny'));

app.use(express.json());

app.use(express.static('public'));

app.use(router);

app.listen(3000, () => console.log('Server is running'));