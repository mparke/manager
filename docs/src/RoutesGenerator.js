import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import _ from 'lodash';

import {
  Endpoint,
  EndpointIndex
} from '~/components';


export function generateIndexRoute(props) {
  const { endpoint, key } = props;

  return (
    <Route
      key={key}
      component={EndpointIndex}
      endpoint={endpoint}
      path={endpoint.path}
    />
  );
}

export function generateChildRoute(props) {
  const { endpoint } = props;

  let childEndpoints = null;
  if (endpoint.formattedEndpoints) {
    childEndpoints = endpoint.formattedEndpoints.map(function(childEndpoint, index) {
      if (childEndpoint.formattedEndpoints && childEndpoint.formattedEndpoints.length) {
        return generateChildRoute({ endpoint: childEndpoint });
      }

      return (
        <Route
          key={index}
          component={Endpoint}
          endpoint={childEndpoint}
          path={childEndpoint.path}
        />
      );
    });
    childEndpoints = _.flatten(childEndpoints);
  }

  return childEndpoints;
}