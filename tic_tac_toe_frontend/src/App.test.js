import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe header', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /tic tac toe/i })).toBeInTheDocument();
});
