import React, { PropTypes } from 'react';


export default function PlanStyle(props) {
  const { plan, current } = props;

  if (!plan || !plan.label) {
    return null;
  }

  const planStr = plan.label.split(' ');
  const currentStr = current ? ' - Current' : '';
  return (
    <span>
      {`${planStr[0]} ${parseInt(planStr[1], 10) / 1024}G${currentStr}`}
    </span>
  );
}

PlanStyle.propTypes = {
  plan: PropTypes.object,
  current: PropTypes.bool,
};
