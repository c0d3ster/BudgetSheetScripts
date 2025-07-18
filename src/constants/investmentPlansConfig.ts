// Investment Plan Configuration - Percentage distributions and colors for different investment strategies
export const INVESTMENT_PLANS_CONFIG = {
  // Investment Plan Data - Percentage distributions for different investment strategies
  PLANS: {
    'Conservative Plan': {
      Savings: 50,
      'Brokerage Account': 10,
      'Precious Metals': 10,
      Cryptocurrencies: 0,
      'Vacation Fund': 10,
      'Education Fund': 20,
      tagline: 'Minimal risk with steady, predictable growth',
      description:
        'Safe, conservative approach focused on building a strong savings and education fund. Recommended for those with less than 6 months of living expenses saved.',
    },
    'Risktaker Plan': {
      Savings: 10,
      'Brokerage Account': 30,
      'Precious Metals': 10,
      Cryptocurrencies: 25,
      'Vacation Fund': 10,
      'Education Fund': 15,
      tagline: 'High-risk, high-reward strategy',
      description:
        'Strong focus on aggressive growth investments and cryptocurrencies. Suitable for those comfortable with volatility that already have 6 months of living expenses saved.',
    },
    'Family Plan': {
      Savings: 20,
      'Brokerage Account': 10,
      'Precious Metals': 10,
      Cryptocurrencies: 5,
      'Vacation Fund': 25,
      'Education Fund': 30,
      tagline: 'Moderate risk with diversified investments',
      description:
        'Balanced approach prioritizing family needs with strong education funding and vacation savings. Services such as Acorns Early or Henry are great for education fund management.',
    },
    'Baller Plan': {
      Savings: 0,
      'Brokerage Account': 10,
      'Precious Metals': 25,
      Cryptocurrencies: 15,
      'Vacation Fund': 50,
      'Education Fund': 0,
      tagline: 'For those who want to ball out!',
      description:
        'Luxury-focused strategy emphasizing lifestyle and experiences. Heavy investment in vacation funding and precious metals to live your best life in the here and now.',
    },
  },

  // Investment Plan Category Colors - Consistent colors for each category
  CATEGORY_COLORS: {
    Savings: '#00A651', // Savings Green
    'Brokerage Account': '#FF6B6B', // Growth Red
    'Precious Metals': '#FFD93D', // Yellow
    Cryptocurrencies: '#6C5CE7', // Purple
    'Vacation Fund': '#A8E6CF', // Light Green with blue tint
    'Education Fund': '#FF6B35', // Light Virginia Tech Orange
    Remainder: '#E0E0E0', // Light Gray
  },

  // Cell configurations for investment plans
  PLAN_DROPDOWN_CELL: 'K35',
  PLAN_TAGLINE_CELL: 'K37',
  PLAN_DESCRIPTION_CELL: 'K39',
}
