import { render, screen } from '@testing-library/react';
import App from './App';
import { Buffer } from 'buffer';

window.Buffer = Buffer;

test('renders learn react link', () => {
  // render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
