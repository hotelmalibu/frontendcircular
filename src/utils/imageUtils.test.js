import { getImageProxyUrl } from './imageUtils';

jest.mock('../api', () => ({ API_ORIGIN: 'http://10.158.8.77:8000' }));

test.each([
  ['http://localhost:8000/storage/news/photo.jpg', 'http://10.158.8.77:8000/storage/news/photo.jpg'],
  ['https://localhost/storage/news/photo.jpg', 'http://10.158.8.77:8000/storage/news/photo.jpg'],
  ['http://127.0.0.1:8000/storage/teams/photo.jpg?size=40', 'http://10.158.8.77:8000/storage/teams/photo.jpg?size=40'],
  ['/storage/news/photo.jpg', 'http://10.158.8.77:8000/storage/news/photo.jpg'],
  ['storage/news/photo.jpg', 'http://10.158.8.77:8000/storage/news/photo.jpg'],
  ['news/photo.jpg', 'http://10.158.8.77:8000/storage/news/photo.jpg'],
  ['NEWS123.jpg', 'http://10.158.8.77:8000/storage/news/NEWS123.jpg'],
  ['https://cdn.example.test/photo.jpg', 'https://cdn.example.test/photo.jpg'],
])('normalizes public resource %s without duplicating ports or storage', (input, expected) => {
  expect(getImageProxyUrl(input)).toBe(expected);
});

test('prefers the URL supplied by the API and preserves a valid signed URL exactly', () => {
  const url = 'http://10.158.8.77:8000/api/secure-file/01?expires=123&signature=abc';
  expect(getImageProxyUrl({ url, path: 'documents/legacy.pdf' })).toBe(url);
  expect(getImageProxyUrl('http://localhost:8000/api/secure-file/01?signature=abc')).toBe('');
});

test('rejects credential-bearing and unsupported URL schemes', () => {
  expect(getImageProxyUrl('https://user:pass@host.example/photo.jpg')).toBe('');
  // eslint-disable-next-line no-script-url -- Intentional hostile fixture: verify that the application rejects it.
  expect(getImageProxyUrl('javascript:alert(1)')).toBe('');
});
