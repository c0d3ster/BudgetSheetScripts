# Budget Sheet Template - Distribution Guide

## Etsy Sales Strategy

### Two-Tier Pricing Model

#### Plan 1: One-Time Purchase ($15-25)
**What Customers Receive:**
1. **Google Sheet Template** with embedded scripts
2. **Setup Instructions** (PDF)
3. **Support Documentation**
4. **Lifetime access** to the template
5. **Email support** for 30 days

#### Plan 2: Monthly Subscription ($5/month)
**What Customers Receive:**
1. **Web app access** with latest features
2. **Continuous updates** and improvements
3. **Priority support**
4. **Advanced features** (analytics, multiple sheets, etc.)
5. **No setup required** - just access via URL

### Development Workflow

#### For Development:
```bash
# Make changes to TypeScript files
yarn dev          # Watch mode for development
yarn push         # Update your development sheet
```

#### For Template Updates (One-Time Purchase):
```bash
# Update the template for one-time customers
yarn template:prepare  # Build the latest version
yarn push              # Update the template sheet
# The template sheet is always the latest version
```

#### For Web App Updates (Monthly Subscription):
```bash
# Deploy updates for subscription customers
yarn webapp:prepare    # Build the latest version
yarn deploy:webapp     # Deploy as web app
```

### Template Setup Instructions

#### One-Time Purchase Setup:
1. **Copy the template** to their Google Drive
2. **Enable Google Apps Scripts** (if prompted)
3. **Authorize the script** to access their sheets
4. **Customize categories** and budget amounts
5. **Start tracking** their budget!

#### Monthly Subscription Setup:
1. **Receive web app URL** after purchase
2. **No setup required** - just access via browser
3. **Login with Google account**
4. **Start using immediately**

### Pricing Strategy

#### One-Time Purchase: $15-25
- **Lifetime access** to template
- **No monthly fees**
- **Works offline**
- **Basic support**

#### Monthly Subscription: $5/month
- **Web app access**
- **Continuous updates**
- **Priority support**
- **Advanced features**
- **No setup required**

### Marketing Copy Ideas

#### Etsy Listing Title:
"Automated Budget Tracker - Choose Your Plan: Template or Web App"

#### Plan Comparison:
**One-Time Purchase ($20):**
- ✅ **Lifetime access** - no monthly fees
- ✅ **Works offline** - no internet needed
- ✅ **Complete ownership** - your data stays private
- ✅ **Perfect for** budget-conscious users

**Monthly Subscription ($5/month):**
- ✅ **Always up-to-date** with latest features
- ✅ **No setup required** - access instantly
- ✅ **Priority support** and updates
- ✅ **Perfect for** users who want convenience

### Support Strategy

#### One-Time Purchase Support:
- **Setup guide** with screenshots
- **FAQ section**
- **Email support** for 30 days
- **Community forum** access

#### Monthly Subscription Support:
- **Priority email support**
- **Live chat** during business hours
- **Feature request priority**
- **Personalized setup assistance**

#### Update Strategy:
- **Template updates**: Push to template sheet (always latest)
- **Web app updates**: Deploy new versions monthly
- **Customer notification**: Email updates for both plans

### Technical Implementation

#### Template Management:
- **Single template sheet** that gets updated
- **Version tracking** in Git for rollback if needed
- **Backup strategy** before major updates

#### Web App Management:
- **Separate deployment** for subscription customers
- **Version control** for rollback capability
- **Analytics tracking** for usage patterns

### Customer Management

#### One-Time Customers:
- **Etsy digital download** delivery
- **Email list** for updates and support
- **Template access** via Google Drive link

#### Subscription Customers:
- **Web app access** management
- **Payment processing** (Stripe/PayPal)
- **Usage analytics** and support tracking

### Success Metrics

#### Track These Metrics:
- **Sales volume** by plan type
- **Customer retention** (subscription)
- **Support request frequency** by plan
- **Feature usage** patterns
- **Revenue per customer**

#### Optimization Opportunities:
- **A/B test** pricing for each plan
- **Feature differentiation** between plans
- **Upsell opportunities** from template to subscription
- **Customer feedback** integration 