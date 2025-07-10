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
      tagline: 'Minimal risk with steady, predictable growth',
      description:
        'Safe, conservative approach focused on building a strong emergency fund and education savings. Recommended for those with less than 6 months of living expenses saved.',
    },
    'Risktaker Plan': {
      'Emergency Fund': 10,
      'Brokerage Account': 20,
      'Precious Metals': 10,
      Cryptocurrencies: 35,
      'Vacation Fund': 10,
      'Education Fund': 15,
      tagline: 'High-risk, high-reward strategy',
      description:
        'Strong focus on cryptocurrencies and aggressive growth investments. Suitable for those comfortable with volatility that already have 6 months of living expenses saved.',
    },
    'Family Plan': {
      'Emergency Fund': 20,
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
      'Emergency Fund': 0,
      'Brokerage Account': 10,
      'Precious Metals': 25,
      Cryptocurrencies: 15,
      'Vacation Fund': 50,
      'Education Fund': 0,
      tagline: 'For those who want to ball out!',
      description:
        'Luxury-focused strategy emphasizing lifestyle and experiences. Heavy investment in vacation funding and precious metals. Live your best life in the moment!',
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

  // Cell configurations for investment plans
  PLAN_DROPDOWN_CELL: 'K35',
  PLAN_TAGLINE_CELL: 'K37',
  PLAN_DESCRIPTION_CELL: 'K39',
}
