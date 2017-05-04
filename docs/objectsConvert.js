#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const _ = require('lodash');

const BASE_PATH = './src/data';

const data = JSON.stringify(allEndpoints, null, 2);
const endpointModule = `module.exports = { endpoints: ${data} };`;
fs.writeFileSync(path.join(endpointsPath, 'api.js'), endpointModule);
