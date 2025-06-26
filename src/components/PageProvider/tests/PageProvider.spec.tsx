import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import PageProvider from '../PageProvider';

describe('Test PageProvider', () => {
  it('Should render PageProvider', async () => {
    act(() => {
      render(
        <PageProvider>
          <h1>Test PageProvider</h1>
        </PageProvider>
      );
    });

    expect(screen.getByText('Test PageProvider')).toBeInTheDocument();
  });
});
