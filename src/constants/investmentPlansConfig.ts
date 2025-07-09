// Investment Plan Configuration - Percentage distributions and colors for different investment strategies
export const INVESTMENT_PLANS_CONFIG = {
  // Investment Plan Data - Percentage distributions for different investment strategies
  PLANS: {
    'Conservative Plan': {
      'Emergency Fund': 50,
      'Brokerage Account': 10,
      'Precious Metals': 10,
      Cryptocurrencies: 0,
      'Vacation Fund': 10,
      'Education Fund': 20,
    },
    'Risktaker Plan': {
      'Emergency Fund': 10,
      'Brokerage Account': 20,
      'Precious Metals': 10,
      Cryptocurrencies: 35,
      'Vacation Fund': 10,
      'Education Fund': 15,
    },
    'Family Plan': {
      'Emergency Fund': 20,
      'Brokerage Account': 10,
      'Precious Metals': 10,
      Cryptocurrencies: 5,
      'Vacation Fund': 25,
      'Education Fund': 30,
    },
    'Baller Plan': {
      'Emergency Fund': 0,
      'Brokerage Account': 10,
      'Precious Metals': 25,
      Cryptocurrencies: 15,
      'Vacation Fund': 50,
      'Education Fund': 0,
    },
  },

  // Investment Plan Category Colors - Consistent colors for each category
  CATEGORY_COLORS: {
    'Emergency Fund': '#FF6B6B', // Red
    'Brokerage Account': '#00A651', // TD Ameritrade Green
    'Precious Metals': '#FFD93D', // Yellow
    Cryptocurrencies: '#6C5CE7', // Purple
    'Vacation Fund': '#A8E6CF', // Light Green with blue tint
    'Education Fund': '#FF6B35', // Light Virginia Tech Orange
    Remainder: '#E0E0E0', // Light Gray
  },
}
