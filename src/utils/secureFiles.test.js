import api from '../api';
import { fetchSecureFile, isSecureFileUrl, openDocumentFile, publicDocumentUrl } from './secureFiles';

jest.mock('../api', () => ({
  __esModule: true,
  default: { get: jest.fn() },
  API_ORIGIN: 'https://api.example.test',
}));

beforeEach(() => {
  jest.clearAllMocks();
  URL.createObjectURL = jest.fn(() => 'blob:authorized-file');
  URL.revokeObjectURL = jest.fn();
});

test('accepts only signed-file routes on the configured API origin', () => {
  expect(isSecureFileUrl('https://api.example.test/api/secure-file/01?signature=test')).toBe(true);
  expect(isSecureFileUrl('https://api.example.test/api/form-attachment/01?signature=test')).toBe(true);
  expect(isSecureFileUrl('https://attacker.example/api/secure-file/01')).toBe(false);
  expect(isSecureFileUrl('https://api.example.test.evil.example/api/secure-file/01')).toBe(false);
  expect(isSecureFileUrl('https://user:password@api.example.test/api/secure-file/01')).toBe(false);
  // eslint-disable-next-line no-script-url -- Intentional hostile fixture: verify that the application rejects it.
  expect(isSecureFileUrl('javascript:alert(1)')).toBe(false);
});

test('fetches protected attachments through the API client as blobs', async () => {
  const blob = new Blob(['test'], { type: 'application/pdf' });
  api.get.mockResolvedValue({ data: blob });
  const url = 'https://api.example.test/api/secure-file/01?signature=test';
  await expect(fetchSecureFile(url)).resolves.toBe('blob:authorized-file');
  expect(api.get).toHaveBeenCalledWith(url, { responseType: 'blob' });
  expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
});

test('never fetches a foreign URL through the authenticated API client', async () => {
  await expect(fetchSecureFile('https://attacker.example/api/secure-file/01')).rejects.toThrow();
  expect(api.get).not.toHaveBeenCalled();
});

test('rejects script URLs instead of opening them', async () => {
  // eslint-disable-next-line no-script-url -- Intentional hostile fixture: verify that the application rejects it.
  await expect(openDocumentFile('javascript:alert(1)')).rejects.toThrow();
  expect(api.get).not.toHaveBeenCalled();
});

test('public document frames accept only approved origins and prefer the signed URL', () => {
  expect(publicDocumentUrl({ path: 'documents/legacy.pdf', url: 'https://api.example.test/api/secure-file/01?signature=test' })).toBe('https://api.example.test/api/secure-file/01?signature=test');
  expect(publicDocumentUrl('https://attacker.example/file.pdf')).toBe('');
  expect(publicDocumentUrl('https://user:password@api.example.test/file.pdf')).toBe('');
  // eslint-disable-next-line no-script-url -- Intentional hostile fixture: verify that the application rejects it.
  expect(publicDocumentUrl('javascript:alert(1)')).toBe('');
  expect(publicDocumentUrl({ url: '' })).toBe('');
});
