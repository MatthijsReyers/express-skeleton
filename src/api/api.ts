import express from 'express';

import {api as users} from './users/users.api';

var api = express();

api.use('/users', users);