import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import '../node_modules/antd/dist/antd.css';

import { TimeTracker } from './components/TimeTracker';
import { ActivityRepository } from './dataAccess/activityRepository';
import { TrackingRepository } from './dataAccess/trackingRepository';

ReactDOM.render(
  <TimeTracker
    activityRepository={new ActivityRepository()}
    trackingRepository={new TrackingRepository()}
  />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
