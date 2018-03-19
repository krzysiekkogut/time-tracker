import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import '../node_modules/antd/dist/antd.css';

import { TimeTracker } from './components/TimeTracker';

ReactDOM.render(
  <TimeTracker />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
