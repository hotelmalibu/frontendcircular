import api, { API_ORIGIN } from './index';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: { request: { use: jest.fn() } },
    getUri: (config) => config.url,
  })),
}));

const intercept = api.interceptors.request.use.mock.calls[0][0];

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

test('attaches a session token to the configured API only', () => {
  localStorage.setItem('token', 'synthetic-token');
  const config = intercept({ url: `${API_ORIGIN}/api/document`, headers: {} });
  expect(config.headers.Authorization).toBe('Bearer synthetic-token');
});

test('strips authorization when an absolute URL points outside the API', () => {
  localStorage.setItem('token', 'synthetic-token');
  const config = intercept({ url: 'https://attacker.example/file', headers: { Authorization: 'Bearer synthetic-token' } });
  expect(config.headers.Authorization).toBeUndefined();
});

test('strips authorization regardless of header casing', () => {
  const config = intercept({ url: 'https://attacker.example/file', headers: { authorization: 'Bearer synthetic-token' } });
  expect(config.headers.authorization).toBeUndefined();
});
