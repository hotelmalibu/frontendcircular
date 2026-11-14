import clientLogger from './clientLogger';

test('does not expose diagnostic payloads outside development', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  clientLogger.error('sensitive', { password: 'synthetic', token: 'synthetic' });
  expect(spy).not.toHaveBeenCalled();
  spy.mockRestore();
});
