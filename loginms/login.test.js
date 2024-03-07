const axios = require('axios');
const {
  validateFirstname,
  validateLastname,
  validateEmail,
  validatePassword,
  existingEmailCheck,
} = require('./inputValidation');


// Mocking Axios
jest.mock('axios');

describe('Input Validation Functions', () => {
  describe('validateFirstname', () => {
    test('return true for a non-empty string', () => {
      expect(validateFirstname('beep')).toBe(true);
    });

    test('return false for an empty string', () => {
      expect(validateFirstname('')).toBe(false);
    });
  });

  describe('validateLastname', () => {
    test('return true for a non-empty string', () => {
      expect(validateLastname('boop')).toBe(true);
    });

    test('return false for an empty string', () => {
      expect(validateLastname('')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    test('return true for a valid email address', () => {
      expect(validateEmail('test@testing.com')).toBe(true);
    });

    test('return false for an invalid email address', () => {
      expect(validateEmail('invalid_email_address')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('return true if passwords match', () => {
      expect(validatePassword('password', 'password')).toBe(true);
    });

    test('return false if passwords do not match', () => {
      expect(validatePassword('beepity', 'boopity')).toBe(false);
    });
  });

  describe('existingEmailCheck', () => {
    test('return true if user exists', async () => {
      axios.get.mockResolvedValue({ data: { error: 'User not found' } });
      const result = await existingEmailCheck('existing@email.com');
      expect(result).toBe(true);
    });

    test('return false if user does not exist', async () => {
      axios.get.mockRejectedValue({ response: { data: { error: 'User not found' } } });
      const result = await existingEmailCheck('nonexisting@email.com');
      expect(result).toBe(false);
    });

    test('should handle server error', async () => {
      axios.get.mockRejectedValue({ response: { data: { error: 'Server error' } } });
      const result = await existingEmailCheck('example@email.com');
      expect(result).toBe(undefined); // or handle as per your requirement
    });
  });
});
