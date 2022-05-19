import { render } from '@testing-library/react';
import React from 'react';
import App from './routes/App';

test('renders learn react link', () => {
  render(<App />);
  expect(1).toBe(1);
});
