#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const _ = require('lodash');

const BASE_PATH = './src/data';
const apiObjectMap = require('./src/data/objects/index').apiObjectMap;


function formatMethodParams(methodObj) {
  let params;
  if (methodObj.params) {
    params = Object.keys(methodObj.params).map(function(paramName) {
      const param = methodObj.params[paramName];

      return _.merge({}, param, {
        name: paramName
      });
    });
  }
  return params;
}

function formatMethodExamples(methodObj) {
  let examples;
  if (methodObj.examples) {
    examples = Object.keys(methodObj.examples).map(function(example) {
      return {
        name: example,
        value: methodObj.examples[example]
      };
    });
  }
  return examples;
}

function formatMethodResource(endpoint, method) {
  // IF this is a GET endpoint and has an associated resource object, combine them
  let resourceObject;
  if (method === 'GET' && endpoint.resource) {
    let resource = endpoint.resource;

    // mismatch rewrites
    if (resource === 'account') {
      resource = 'profile';
    }

    resourceObject = apiObjectMap[resource];
    if (!resourceObject && (resource.charAt(resource.length - 1) === 's')) {
      resourceObject = apiObjectMap[resource.substr(0, resource.length - 1)];
    }

    let enums;
    let schema;
    if (resourceObject) {
      enums = resourceObject.enums;
      if (enums) {
        resourceObject.enums = Object.keys(enums).map(function(enumName) {
          return _.merge({}, enums[enumName], {
            name: enumName
          });
        });
      }

      schema = resourceObject.schema;
      if (schema) {
        resourceObject.schema = Object.keys(schema).map(function(schemaName) {
          const schemaField = schema[schemaName];
          return {
            name: schemaName,
            description: schemaField._description,
            editable: schemaField._editable,
            type: schemaField._type,
            value: schemaField._value
          };
        });
      }
    }
  }

  return resourceObject;
}

function formatMethod(endpoint, method) {
  const methodObj = endpoint.methods[method];
  const resourceObj = formatMethodResource(endpoint, method);
  const examples = formatMethodExamples(methodObj);
  const params = formatMethodParams(methodObj);

  return _.merge({}, methodObj, {
    name: method,
    examples: examples,
    params: params,
    resource: resourceObj
  });
}


function formatEndpoint(endpoint, path) {
  let methods = null;
  if (endpoint.methods) {
    methods = Object.keys(endpoint.methods).map(function(method) {
      return formatMethod(endpoint, method);
    });
  }

  return _.merge({}, endpoint, {
    path: path,
    formattedEndpoints: endpoint.formattedEndpoints || [],
    methods: methods
  });
}


const endpointsPath = path.join(BASE_PATH, 'endpoints');
const files = fs.readdirSync(endpointsPath);


let allEndpoints = files.filter(function(fileName) {
  return path.extname(fileName) === '.json';
}).map(function(fileName) {
  const filePath = path.join(endpointsPath, fileName);
  const endpoint = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  return endpoint;
});

// map and nest
let endpointMap = {
  '/linode': {
    name: 'Linodes',
    path: '/linode',
    formattedEndpoints: []
  },
  '/domains': {
    name: 'Domains',
    path: '/domains',
    formattedEndpoints: []
  },
  '/nodebalancers': {
    name: 'NodeBalancers',
    path: '/nodebalancers',
    formattedEndpoints: []
  },
  '/networking': {
    name: 'Networking',
    path: '/networking',
    formattedEndpoints: []
  },
  '/regions': {
    name: 'Regions',
    path: '/regions',
    formattedEndpoints: []
  },
  '/support/tickets': {
    name: 'Support',
    path: '/support',
    formattedEndpoints: []
  },
  '/account': {
    name: 'Account',
    path: '/account',
    formattedEndpoints: []
  },
};
allEndpoints.forEach(function(endpoint) {
  const pathArr = endpoint.base_path.split('/');
  // console.log('PATH ARR: ', pathArr);
  const basePath = `/${pathArr[1]}`;
  const altBasePath = `${basePath}/${pathArr[2]}`;
  console.log('BASE: ', basePath, ' ALT BASE: ', altBasePath);

  if (endpointMap[basePath]) {
    endpointMap[basePath].formattedEndpoints.push(formatEndpoint(endpoint, (pathArr[2] ? altBasePath : basePath)));
  } else if (endpointMap[altBasePath]) {
    endpointMap[altBasePath].formattedEndpoints.push(formatEndpoint(endpoint, altBasePath));
  } else {
    console.log('NO MATCH FOUND: ', basePath);
  }
});

// back to an array
allEndpoints = Object.keys(endpointMap).map(function(key) {
  return endpointMap[key];
}).filter(function(endpoint) { return endpoint; });

// map children
allEndpoints = allEndpoints.map(function(endpoint) {
  endpoint.formattedEndpoints = endpoint.formattedEndpoints.map(function(formattedEndpoint) {
    if (formattedEndpoint.endpoints) {
      Object.keys(formattedEndpoint.endpoints).forEach(function(path) {
        // const pathArr = path.split('/');
        // pathArr.shift(); // remove the base path
        // const restPath = `/${pathArr.join('/')}`;
        // console.log('REST :', restPath);

        const childEndpoint = formattedEndpoint.endpoints[path];
        const childFormattedEndpoint = formatEndpoint(childEndpoint, path);
        formattedEndpoint.formattedEndpoints.push(childFormattedEndpoint);
      });
      delete formattedEndpoint.endpoints;
    }
    return formattedEndpoint;
  });
  return endpoint;
});

const data = JSON.stringify(allEndpoints, null, 2);
const endpointModule = `module.exports = { endpoints: ${data} };`;
fs.writeFileSync(path.join(endpointsPath, 'api.js'), endpointModule);

const compressedData = JSON.stringify(allEndpoints);
const compressedModule = `module.exports = { endpoints: ${compressedData} };`;
fs.writeFileSync(path.join(endpointsPath, 'api_min.js'), compressedModule);
