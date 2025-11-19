
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

declare const global: any;

// Provide a minimal ResizeObserver for the test environment used by @salt-ds components.
  (global as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

afterAll(() => {
  delete (global as any).ResizeObserver;
});

// Mock all lazily imported page modules so Suspense doesn't cause act warnings.
jest.mock('./Modules/Pages/Users', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="users-page">Users{props?.activeTab ?? ''}</div>,
}));
jest.mock('./Modules/Pages/Comments', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="comments-page">Comments{props?.activeTab ?? ''}</div>,
}));
jest.mock('./Modules/Pages/Posts', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="posts-page">Posts{props?.activeTab ?? ''}</div>,
}));
jest.mock('./Modules/Pages/ToggleSwitch', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="switch-page">Switch{props?.activeTab ?? ''}</div>,
}));
jest.mock('./Modules/Pages/GridSelection', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="gridselection-page">GridSelection</div>,
}));

import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(baseElement).toBeTruthy();
  });

  // it('should have a greeting as the title', () => {
  //   const { getAllByText } = render(
  //     <BrowserRouter>
  //       <App />
  //     </BrowserRouter>
  //   );
  //   expect(getAllByText(new RegExp('Welcome @react-crud/react-crud', 'gi')).length > 0).toBeTruthy();
  // });

  it('renders main tab labels', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByText('Users')).toBeTruthy();
    expect(screen.getByText('Comments')).toBeTruthy();
    expect(screen.getByText('Posts')).toBeTruthy();
    expect(screen.getByText('Switch')).toBeTruthy();
    expect(screen.getByText('GridSelection')).toBeTruthy();
  });

  it('navigates to Comments page when Comments tab is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Comments'));
    expect(await screen.findByTestId('comments-page')).toBeTruthy();
    // expect(screen.getByTestId('comments-page').textContent).toMatch(/Comments/);
  });

  it('renders Comments component for initial /comments route', async () => {
    render(
      <MemoryRouter initialEntries={['/comments']}>
        <App />
      </MemoryRouter>
    );
    expect(await screen.findByTestId('comments-page')).toBeTruthy();
  });

  it('renders Users for unknown route (wildcard)', async () => {
    render(
      <MemoryRouter initialEntries={['/some/unknown/path']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByTestId('users-page')).toBeTruthy();
  });
});
