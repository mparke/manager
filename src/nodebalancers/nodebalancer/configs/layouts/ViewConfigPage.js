import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import Breadcrumbs from '~/components/Breadcrumbs';
import { Link } from 'react-router';
import { Card, CardHeader } from 'linode-components/cards';
import { Table } from 'linode-components/tables';
import { List } from 'linode-components/lists';
import { ListBody } from 'linode-components/lists/bodies';
import { LinkCell, ButtonCell } from 'linode-components/tables/cells';
import { nodebalancers } from '~/api';
import { getObjectByLabelLazily, objectFromMapByLabel } from '~/api/util';

export class ViewConfigPage extends Component {
  static async preload({ dispatch, getState }, { nbLabel, configId }) {
    try {
      const { id } = await dispatch(getObjectByLabelLazily('nodebalancers', nbLabel));
      console.log('nodebalancers', nodebalancers);
      console.log('nodebalancernodes aka nodes aka NodetoriousBIG', nodes);
      await dispatch(nodes.all([id, configId]));
    } catch (response) {
      // eslint-disable-next-line no-console
      console.error(response);
      dispatch(setError(response));
    }
  }

  constructor() {
    super();

    this.state = {
      errors: {},
      saving: false,
    };
  }

  render() {
    const { nodebalancer, config, nodes } = this.props;
    console.log('config', config);

    return (
      <div>
        <div className="container">
          <Card header={<CardHeader title="Summary" />}>
            <div className="row">
              <div className="col-sm-2 row-label">Port</div>
              <div className="col-sm-10">{config.port}</div>
            </div>
            <div className="row">
              <div className="col-sm-2 row-label">Protocol</div>
              <div className="col-sm-10">{config.protocol}</div>
            </div>
            <div className="row">
              <div className="col-sm-2 row-label">Algorithm</div>
              <div className="col-sm-10">{config.algorithm}</div>
            </div>
            <div className="row">
              <div className="col-sm-2 row-label">Session Stickiness</div>
              <div className="col-sm-10">{config.stickiness}</div>
            </div>
          </Card>
          <Card title="Nodes"
            header={
              <CardHeader
                title="Nodes"
                nav={
                  <Link
                    to={`/nodebalancers/${nodebalancer.label}/configurations/${config.id}/create`}
                    className="linode-add btn btn-default float-sm-right"
                  >Add a Node</Link>
                }
              />
            }
          >
            <List>
              <ListBody>
                <Table
                  className="Table--secondary"
                  columns={[
                    { textKey: 'label', label: 'Label',
                      cellComponent: LinkCell,
                      hrefFn: function (node) {
                        return `/nodebalancers/${nodebalancer.label}/configurations/${config.id}/nodes/${node.id}`;
                      },
                    },
                    { dataKey: 'address', label: 'Address' },
                    { dataKey: 'weight', label: 'Weight' },
                    { dataKey: 'mode', label: 'Mode' },
                    { dataKey: 'status', label: 'Status' },
                    { dataKey: 'last_status_change', label: 'Last status change' },
                    {
                      cellComponent: ButtonCell,
                      buttonClassName: 'btn-secondary',
                      hrefFn: function (node) {
                        return `/nodebalancers/${nodebalancer.label}/configurations/${config.id}/nodes/${node.id}/edit`;
                      },
                      text: 'Edit',
                    },
                  ]}
                  data={Object.values(nodes.nodes)}
                  selectedMap={{}}
                />
              </ListBody>
            </List>
          </Card>
        </div>
      </div>
    );
  }
}

ViewConfigPage.propTypes = {
  config: PropTypes.object.isRequired,
  nodebalancer: PropTypes.object.isRequired,
};

function select(state, props) {
  const { nbLabel, configId } = props.params;
  const nodebalancer = objectFromMapByLabel(state.api.nodebalancers.nodebalancers, nbLabel);
  const config = objectFromMapByLabel(nodebalancer._configs.configs, +configId, 'id');
  const nodes = objectFromMapByLabel(nodebalancer._configs.configs._nodes.nodes);
  return { config, nodebalancer, nodes };
}

export default connect(select)(ViewConfigPage);
