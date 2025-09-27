// Utility functions and constants

export const EMOTION_LABELS = {
  0: 'Not at all',
  1: 'Slightly',
  2: 'Moderately',
  3: 'Considerably',
  4: 'Extremely',
  5: 'Overwhelmingly'
};

export const SKILL_LABELS = {
  0: 'Didn\'t use',
  1: 'Used poorly',
  2: 'Used somewhat',
  3: 'Used well',
  4: 'Used very well',
  5: 'Used excellently'
};

export function formatDate(date = new Date()) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export function validateRating(rating) {
  return Number.isInteger(rating) && rating >= 0 && rating <= 5;
}