/**
 * Shared validation helpers for email addresses and phone numbers sitewide
 */

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const cleaned = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(cleaned);
};

export const validatePhone = (phone) => {
  if (!phone) return false;
  const phoneStr = String(phone).trim();
  // Remove country code prefix (+91, 91, 0) and non-digit characters
  const digitsOnly = phoneStr.replace(/^(\+91[\s-]?|91[\s-]?|0)/, '').replace(/\D/g, '');
  // Valid if exactly 10 digits and starts with 6, 7, 8, or 9 (Indian mobile standard)
  return /^[6-9]\d{9}$/.test(digitsOnly);
};

export const cleanPhoneNumber = (phone) => {
  if (!phone) return '';
  const phoneStr = String(phone).trim();
  return phoneStr.replace(/^(\+91[\s-]?|91[\s-]?|0)/, '').replace(/\D/g, '');
};
