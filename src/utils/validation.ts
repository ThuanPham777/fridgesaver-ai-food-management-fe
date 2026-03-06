export const validation = {
  isEmail: (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),

  isStrongPassword: (value: string): boolean =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value),

  isUrl: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  isPhoneNumber: (value: string): boolean =>
    /^\+?[\d\s\-().]{7,15}$/.test(value),

  isNotEmpty: (value: string): boolean => value.trim().length > 0,

  minLength:
    (min: number) =>
    (value: string): boolean =>
      value.length >= min,

  maxLength:
    (max: number) =>
    (value: string): boolean =>
      value.length <= max,
};
