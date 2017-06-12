import React from 'react';

import { Breadcrumbs } from 'linode-components/breadcrumbs';
import { Table } from 'linode-components/tables';
import { LinkCell } from 'linode-components/tables/cells';

import { API_ROOT, API_VERSION } from '~/constants';

export default function Index() {
  return(
    <section className="Article">
      <h1>cURL Guides</h1>
      <Table
        className="Table--secondary"
        columns={[
          {
            cellComponent: LinkCell,
            textKey: 'path',
            label: 'Title',
            headerClassName: 'SectionColumn',
            hrefFn: function(subPage) {
              return subPage.href;
            }
          },
          { label: 'Description', dataKey: 'description' },
        ]}
        data={[
          {
            href: `/${API_VERSION}/guides/curl/testing-with-curl`,
            path: 'Testing with cURL',
            description: 'A crash course on cURL and how to use it to try out the API.',
          },
          {
            href: `/${API_VERSION}/guides/curl/creating-a-linode`,
            path: 'Creating a Linode',
            description: 'Starting from nothing and ending with a running Linode instance.',
          },
        ]}
      />
      <h1>Python Guides</h1>
      <Table
        className="Table--secondary"
        columns={[
          {
            cellComponent: LinkCell,
            textKey: 'path',
            label: 'Title',
            headerClassName: 'SectionColumn',
            hrefFn: function(subPage) {
              return subPage.href;
            }
          },
          { label: 'Description', dataKey: 'description' },
        ]}
        data={[
          {
            href: `/${API_VERSION}/guides/python/getting-started`,
            path: 'Getting started with Linode Python',
            description: 'A quick guide on getting started with the official Linode Python wrapper',
          },
        ]}
      />
    </section>
  );
}