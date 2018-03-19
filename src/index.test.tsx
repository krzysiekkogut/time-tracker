import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TimeTracker } from './components/TimeTracker';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TimeTracker />, div);
});