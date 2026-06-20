export const BOARD_SPACES = [
  { id: 0, type: 'START', label: 'START (Allowance Drop)', description: "Receive allowance. Pay $50 Initiation Tax immediately.", initiationTax: 50 },
  { id: 1, type: 'DRAIN_ZONE', label: 'Coffee Fund', color: 'brown', levels: [10, 25, 50], description: "Goddess needs Her caffeine fix.", icon: '/coffee_fund_icon.png' },
  { id: 2, type: 'MAINTENANCE_DECREE', label: 'Maintenance Decree', description: "Draw a card.", icon: '/tribute_icon.png' },
  { id: 3, type: 'DRAIN_ZONE', label: 'Lip Gloss Fund', color: 'brown', levels: [15, 35, 70], description: "Keep Her lips shiny.", icon: '/lip_gloss_fund_icon.png' },
  { id: 4, type: 'TAX', label: 'Income Tax', price: 20, description: "The Daily Fee: Pay $20.", icon: '/tribute_icon.png' },
  { id: 5, type: 'TRANSFER', label: 'Uber for the Queen', price: 25, color: 'pink-line', description: "Pay $25.", icon: '/atm_drain_icon.png' },
  { id: 6, type: 'DRAIN_ZONE', label: 'Champagne Toast', color: 'light-blue', levels: [30, 60, 120], description: "Celebrate Her brilliance.", icon: '/tribute_icon.png' },
  { id: 7, type: 'GODDESS_LUCK', label: 'Goddess Luck', description: "Draw a card.", icon: '/luck_icon.png' },
  { id: 8, type: 'DRAIN_ZONE', label: 'Flower Delivery', color: 'light-blue', levels: [40, 80, 160], description: "Fill Her room with beauty.", icon: '/tribute_icon.png' },
  { id: 9, type: 'DRAIN_ZONE', label: 'Manicure Tax', color: 'light-blue', levels: [50, 100, 200], description: "Her nails must be perfect.", icon: '/tribute_icon.png' },
  { id: 10, type: 'JAIL', label: 'WAITING ROOM', description: "Holding Pattern. Stay here until She summons you.", icon: '/debt_prison_icon.png' },
  { id: 11, type: 'SUBSCRIPTION', label: 'Digital Maid Service', price: 30, description: "Monthly Fee: $30.", icon: '/tribute_icon.png' },
  { id: 12, type: 'DRAIN_ZONE', label: 'Spa Day Contribution', color: 'pink', levels: [100, 250, 500], description: "Relaxation isn't free.", icon: '/tribute_icon.png' },
  { id: 13, type: 'DRAIN_ZONE', label: 'Designer Desire', color: 'pink', levels: [150, 350, 700], description: "She saw something sparkly.", icon: '/tribute_icon.png' },
  { id: 14, type: 'MAINTENANCE_DECREE', label: 'Maintenance Decree', description: "Draw a card.", icon: '/tribute_icon.png' },
  { id: 15, type: 'DRAIN_ZONE', label: 'Wardrobe Refresh', color: 'pink', levels: [200, 450, 900], description: "She needs a new designer bag.", icon: '/tribute_icon.png' },
  { id: 16, type: 'TRANSFER', label: 'First Class Flight', price: 100, color: 'blue-line', description: "Pay $100.", icon: '/atm_drain_icon.png' },
  { id: 17, type: 'DRAIN_ZONE', label: 'Rent Contribution', color: 'orange', levels: [250, 600, 1200], description: "Help keep Her palace beautiful.", icon: '/tribute_icon.png' },
  { id: 18, type: 'GODDESS_LUCK', label: 'Goddess Luck', description: "Draw a card.", icon: '/luck_icon.png' },
  { id: 19, type: 'DRAIN_ZONE', label: 'Credit Card Cleansing', color: 'orange', levels: [300, 750, 1500], description: "Pay Her credit card bill.", icon: '/tribute_icon.png' },
  { id: 20, type: 'DRAIN_ZONE', label: 'Shopping Spree', color: 'orange', levels: [350, 850, 1700], description: "Buy everything She wants.", icon: '/tribute_icon.png' },
  { id: 21, type: 'SERVICE', label: 'SERVICE SQUARE', description: "Free Parking. Write 50 lines of devotion to earn a Loyalty Token.", icon: '/loyalty_token.png' },
  { id: 22, type: 'DRAIN_ZONE', label: 'ATM DRAIN', color: 'red', levels: [400, 1000, 2000], description: "You are Her personal ATM.", icon: '/atm_drain_icon.png' },
  { id: 23, type: 'GODDESS_LUCK', label: 'Goddess Luck', description: "Draw a card.", icon: '/luck_icon.png' },
  { id: 24, type: 'DRAIN_ZONE', label: 'Holiday Fund', color: 'red', levels: [500, 1250, 2500], description: "She needs a vacation.", icon: '/tribute_icon.png' },
  { id: 25, type: 'DRAIN_ZONE', label: 'Jewelry Upgrade', color: 'red', levels: [600, 1500, 3000], description: "Something gold, something sparkly.", icon: '/tribute_icon.png' },
  { id: 26, type: 'TRANSFER', label: 'Limousine Service', price: 150, color: 'green-line', description: "Pay $150.", icon: '/atm_drain_icon.png' },
  { id: 27, type: 'DRAIN_ZONE', label: 'Debt Consolidation', color: 'yellow', levels: [700, 1750, 3500], description: "Help Her clear Her 'expenses'.", icon: '/tribute_icon.png' },
  { id: 28, type: 'DRAIN_ZONE', label: "Goddess's Night Out", color: 'yellow', levels: [800, 2000, 4000], description: "Cover Her dinner and drinks.", icon: '/tribute_icon.png' },
  { id: 29, type: 'SUBSCRIPTION', label: 'VIP Access', price: 100, description: "Monthly Fee: $100.", icon: '/tribute_icon.png' },
  { id: 30, type: 'DRAIN_ZONE', label: 'Ultimate Devotion', color: 'yellow', levels: [1000, 2500, 5000], description: "Empty your 'fun money' account.", icon: '/shrine_icon.png' },
  { id: 31, type: 'GO_TO_JAIL', label: 'GO TO DEBT PRISON', description: "You've been too loud. Go to the Holding Pattern.", icon: '/debt_prison_icon.png' },
  { id: 32, type: 'DRAIN_ZONE', label: 'Palace Renovation', color: 'green', levels: [1200, 3000, 6000], description: "Upgrade Her living space.", icon: '/palace_renovation_icon.png' },
  { id: 33, type: 'DRAIN_ZONE', label: 'Luxury Car Lease', color: 'green', levels: [1500, 3750, 7500], description: "Tribute Her travel style.", icon: '/tribute_icon.png' },
  { id: 34, type: 'MAINTENANCE_DECREE', label: 'Maintenance Decree', description: "Draw a card.", icon: '/tribute_icon.png' },
  { id: 35, type: 'DRAIN_ZONE', label: 'Real Estate Investment', color: 'green', levels: [2000, 5000, 10000], description: "Invest in Her future.", icon: '/shrine_icon.png' },
  { id: 36, type: 'TRANSFER', label: 'Private Jet', price: 500, color: 'gold-line', description: "Pay $500.", icon: '/atm_drain_icon.png' },
  { id: 37, type: 'RUINOUS_DEMAND', label: 'Ruinous Demand', color: 'dark-blue', levels: [3000, 7500, 15000], description: "Absolute financial priority.", icon: '/drain_icon.png' },
  { id: 38, type: 'TAX', label: "Queen's Ransom", price: 250, description: "Luxury Tax: Pay $250.", icon: '/tribute_icon.png' },
  { id: 39, type: 'DRAIN_ZONE', label: 'Complete Surrender', color: 'dark-blue', levels: [5000, 12500, 25000], description: "Total submission.", icon: '/drain_icon.png' },
];

export const getDependencyTier = (pos) => {
  if (pos <= 10) return { id: 1, name: 'Maintenance', icon: '/tier_maintenance.png' };
  if (pos <= 21) return { id: 2, name: 'Dedication', icon: '/tier_dedication.png' };
  return { id: 3, name: 'Devotion', icon: '/tier_devotion.png' };
};

export const MAINTENANCE_DECREES = [
  { id: 'm1', label: 'Social Praise', description: "Like and Retweet Her latest 3 posts.", type: 'TASK' },
  { id: 'm2', label: 'Devotional Lines', description: "Send 25 lines in DM: 'Goddess [Name] is my absolute priority.'", type: 'TASK' },
  { id: 'm3', label: 'Caffeine Kick', description: "Tribute $5 for Her next coffee.", price: 5, type: 'TRIBUTE' },
  { id: 'm4', label: 'Beauty Fund', description: "Tribute $10 for Her lash fund.", price: 10, type: 'TRIBUTE' },
  { id: 'm5', label: 'RT Challenge', description: "Retweet Her pinned post immediately.", type: 'TASK' },
  { id: 'm6', label: 'Bio Mark', description: "Add 'Owned by Goddess [Name]' to your bio for 30 minutes.", type: 'TASK' },
  { id: 'm7', label: 'Wishlist Hype', description: "Post a link to Her wishlist with a begging caption.", type: 'TASK' },
  { id: 'm8', label: 'Consent Check', description: "Message Goddess and ask: 'May I please continue to serve, Goddess?'", type: 'TASK' },
  { id: 'm9', label: 'Space Audit', description: "Screenshot your clean desktop to show your disciplined workspace.", type: 'TASK' },
  { id: 'm10', label: 'Recruitment', description: "Tag one potential sub in Her latest post.", type: 'TASK' },
  { id: 'm11', label: 'Heel Polish', description: "Tribute $15 for shoe care.", price: 15, type: 'TRIBUTE' },
  { id: 'm12', label: 'Bubbly Tax', description: "Tribute $10 for Her next glass of champagne.", price: 10, type: 'TRIBUTE' },
  { id: 'm13', label: 'Ride Share', description: "Tribute $5 for Her next Uber.", price: 5, type: 'TRIBUTE' },
  { id: 'm14', label: 'Presence Fee', description: "Tribute $20 for the privilege of being in the room.", price: 20, type: 'TRIBUTE' },
  { id: 'm15', label: 'Manicure Polish', description: "Tribute $15 for Her next set.", price: 15, type: 'TRIBUTE' },
];

export const RUINOUS_DEMANDS = [
  { id: 'r1', label: 'Wallet Rinse', description: "Send 10% of your current bank balance to Her Wishtender.", type: 'DRAIN_PERCENT', percent: 0.1 },
  { id: 'r2', label: 'Luxury Purchase', description: "Buy the top item on Her wishlist (Max $500).", price: 500, type: 'TRIBUTE' },
  { id: 'r3', label: 'Credit Clear', description: "Pay $300 towards Her credit card bill.", price: 300, type: 'TRIBUTE' },
  { id: 'r4', label: 'Travel Fund', description: "Tribute $400 towards Her next luxury vacation.", price: 400, type: 'TRIBUTE' },
  { id: 'r5', label: 'Gold Standard', description: "Tribute $350 for Her jewelry fund.", price: 350, type: 'TRIBUTE' },
  { id: 'r6', label: 'ATM Drain', description: "Tribute $250 immediately. No questions asked.", price: 250, type: 'TRIBUTE' },
  { id: 'r7', label: 'Debt Transfer', description: "Transfer $450 to Goddess's account.", price: 450, type: 'TRIBUTE' },
  { id: 'r8', label: 'True Devotion', description: "Empty your 'fun money' account and send $750.", price: 750, type: 'TRIBUTE' },
  { id: 'r9', label: 'Palace Fund', description: "Send $1000 towards Her interior design wishlist.", price: 1000, type: 'TRIBUTE' },
  { id: 'r10', label: 'Surrender or Quit', description: "Send $500 or forfeit your position and be banned from the session.", price: 500, type: 'DRAIN_OR_QUIT' },
];

export const LEVERAGE_CARDS = [
  { id: 'l1', label: 'The Silent Treatment', description: "Pay $150 or Goddess will ignore you for the next 24 hours.", price: 150, type: 'LEVERAGE' },
  { id: 'l2', label: 'Board Exclusion', description: "Pay $200 or stay in Debt Prison for your next 3 turns.", price: 200, type: 'LEVERAGE_PRISON' },
  { id: 'l3', label: 'Interest Penalty', description: "Pay 25% interest on the total amount you've tributed this session.", type: 'LEVERAGE_INTEREST', percent: 0.25 },
  { id: 'l4', label: 'Royal Ransom', description: "Pay $300 to avoid an immediate 'Ruinous Demand'.", price: 300, type: 'LEVERAGE_RANSOM' },
  { id: 'l5', label: 'Total Puppetry', description: "The Goddess takes control of your next 3 moves (She chooses where you land).", type: 'LEVERAGE_CONTROL', turns: 3 },
];

export const LUCK_CARDS = [
  ...MAINTENANCE_DECREES.map(d => ({ ...d, deck: 'MAINTENANCE' })),
  ...RUINOUS_DEMANDS.map(d => ({ ...d, deck: 'RUINOUS' })),
];
