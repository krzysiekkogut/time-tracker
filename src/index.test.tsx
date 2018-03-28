import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TimeTracker } from './components/TimeTracker';
import { IActivityRepository } from './dataAccess/activityRepository';
import { ITrackingRepository } from './dataAccess/trackingRepository';
import { Activity } from './model/activity';
import { TrackingEntry } from './model/trackingEntry';

it('renders without crashing', () => {
  const div = document.createElement('div');

  const mockActivityRepository: IActivityRepository = {
    add: (activityName: string) => {
      return {
        name: activityName,
        colorHex: '#00ff99'
      };
    },
    clearAll: () => { return; },
    getAll: () => [],
    saveAll: (activities: Activity[]) => { return; }
  };

  const mockTrackingRepository: ITrackingRepository = {
    add: (trackingEntry: TrackingEntry) => trackingEntry,
    clearAll: () => { return; },
    getAll: () => [],
    saveAll: (trackingEntries: TrackingEntry[]) => { return; }
  };

  ReactDOM.render(
    <TimeTracker
      activityRepository={mockActivityRepository}
      trackingRepository={mockTrackingRepository}
    />,
    div
  );
});