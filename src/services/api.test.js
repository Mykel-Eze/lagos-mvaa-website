// src/services/api.test.js
//
// Tests for the auth logic in api.js:
//  - login stores the opaque encrypted envelope verbatim (no `&<appId>` suffix)
//  - updateAccount routes to the company vs individual endpoint based on
//    user_type, and honours the explicit isCompany flag.

// Mock axios with a single shared instance. The instance is created inside the
// factory (which jest hoists above the imports) and the same reference is returned
// on every create() call, so the test can retrieve it via axios.create().
jest.mock('axios', () => {
  const instance = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    interceptors: { request: { use: jest.fn() } },
  };
  return { __esModule: true, default: { create: () => instance } };
});

import axios from 'axios';
import { login, loginCompany, updateAccount } from './api';

const mockApi = axios.create();

const ENVELOPE =
  '{"iv":"M4jNDe1XX+irqK7G","txt":"pTYbF4/J6k7W8+XRPU3EDqK","tag":"WCsuPXVPRp/qqHxVpiIlFA==","used":0,"purpose":"login"}';

beforeEach(() => {
  sessionStorage.clear();
  mockApi.get.mockReset();
  mockApi.post.mockReset();
  mockApi.patch.mockReset();
  // Default: any profile fetch resolves to an empty profile.
  mockApi.get.mockResolvedValue({ data: {} });
});

describe('login', () => {
  it('stores the opaque envelope verbatim with no &appId suffix', async () => {
    mockApi.post.mockResolvedValueOnce({
      data: { status: 200, message: 'login successful', success: 'true', data: ENVELOPE },
    });

    await login('user@example.com', 'pw');

    expect(sessionStorage.getItem('portal_session_id')).toBe(ENVELOPE);
    expect(sessionStorage.getItem('portal_session_id')).not.toContain('&75e6df');
    expect(sessionStorage.getItem('user_access_token')).toBe(ENVELOPE);
    expect(sessionStorage.getItem('user_type')).toBe('individual');
  });

  it('hits the individual signin endpoint', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { data: ENVELOPE } });

    await login('user@example.com', 'pw');

    expect(mockApi.post).toHaveBeenCalledWith('/portal/auth/signin', {
      email: 'user@example.com',
      password: 'pw',
    });
  });

  it('does not persist a session when no envelope is returned', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { status: 200, data: '' } });

    await login('user@example.com', 'pw');

    expect(sessionStorage.getItem('portal_session_id')).toBeNull();
  });
});

describe('loginCompany', () => {
  it('records the company account type', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { data: ENVELOPE } });

    await loginCompany('co@example.com', 'pw');

    expect(mockApi.post).toHaveBeenCalledWith('/portal/auth/signin-entity', {
      email: 'co@example.com',
      password: 'pw',
    });
    expect(sessionStorage.getItem('user_type')).toBe('company');
  });
});

describe('updateAccount endpoint routing', () => {
  beforeEach(() => {
    sessionStorage.setItem('user_access_token', ENVELOPE);
    mockApi.patch.mockResolvedValue({ data: {} });
  });

  it('uses the individual endpoint when user_type is individual', async () => {
    sessionStorage.setItem('user_type', 'individual');

    await updateAccount('user@example.com', { firstName: 'A' });

    expect(mockApi.patch.mock.calls[0][0]).toBe('/portal/accounts/update-account/user@example.com');
  });

  it('uses the company endpoint when user_type is company', async () => {
    sessionStorage.setItem('user_type', 'company');

    await updateAccount('co@example.com', { firstName: 'A' });

    expect(mockApi.patch.mock.calls[0][0]).toBe('/portal/accounts/update-company-account/co@example.com');
  });

  it('honours an explicit isCompany flag over user_type', async () => {
    sessionStorage.setItem('user_type', 'individual');

    await updateAccount('co@example.com', { firstName: 'A' }, true);

    expect(mockApi.patch.mock.calls[0][0]).toBe('/portal/accounts/update-company-account/co@example.com');
  });
});
