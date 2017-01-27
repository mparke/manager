import { expect } from 'chai';

import { api } from '@/data';

import { sortEvents } from '~/components/notifications';

describe('components/notifications/util', () => {
  // TODO: this test could use more varied dates in test data
  it('should sort events by date', () => {
    const events = Object.values(api.events.events);
    expect(events[0].id).to.equal(385);
    expect(events[1].id).to.equal(386);

    const sortedEvents = sortEvents(api.events);
    expect(sortedEvents[0].id).to.equal(386);
    expect(sortedEvents[1].id).to.equal(385);
  });
});
