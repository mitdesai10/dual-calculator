# 🚀 Quick Start Guide - Dual Mode Staffing Calculator

## What's New? 🎉

Your staffing calculator now has **TWO MODES**:

### 📊 Margin Mode (Your Original Calculator)
- Budget-based staffing with margin optimization
- Perfect for: Project budgets, resource planning, margin targeting

### ⚖️ Blended Rate Mode (NEW!)
- Calculate weighted average rates across roles
- Perfect for: Proposals, rate cards, pricing analysis

## How to Switch Modes

Click the buttons at the top:
- **📊 Margin Mode** - For budget-based planning
- **⚖️ Blended Rate** - For blended rate calculations

## Files You Need

All files are in the `/mnt/user-data/outputs/` folder:

```
📁 Your Calculator Files:
├── index.html ..................... Main file (open this!)
├── styles-enhanced.css ............ All the styling
├── script__2_.js .................. Margin mode logic
├── script-blended.js .............. Blended rate logic
├── sheetsConfig__1_.js ............ Google Sheets config
├── sheetsLoader__1_.js ............ Loads data from Sheets
├── rateCardData.js ................ Backup rate card data
└── README.md ...................... Full documentation

```

## Setup in 3 Steps

### Step 1: Update Google Sheets Config
Open `sheetsConfig__1_.js` and update:
```javascript
SHEET_ID: 'YOUR_ACTUAL_SHEET_ID'
```

### Step 2: Upload to Web Hosting
- Upload ALL files to the same folder
- Keep the same filenames

### Step 3: Open in Browser
- Navigate to your index.html
- Start using either mode!

## Quick Examples

### Using Margin Mode:
```
1. Click "Margin Mode"
2. Enter budget: $3,400,000
3. Positions: 7
4. Target margin: 55-60%
5. Add positions
6. Get optimized rates!
```

### Using Blended Rate Mode:
```
1. Click "Blended Rate"
2. Click "Add Another Role"
3. Select: Senior Consultant → Onshore → 80 hours
4. Add more roles as needed
5. See blended rate instantly!
```

## Your Data

**Same Google Sheet works for both modes!**

Format:
| Role | Onshore | Offshore | Nearshore |
|------|---------|----------|-----------|
| Senior Consultant | 150 | 75 | 100 |
| Consultant | 120 | 60 | 80 |

## Key Benefits

✅ **One Calculator, Two Modes** - Switch anytime  
✅ **Same Data Source** - Uses your existing Google Sheet  
✅ **Independent States** - Each mode remembers its data  
✅ **Mobile Friendly** - Works on all devices  
✅ **Real-Time Updates** - See changes instantly  

## Need Help?

Check the full `README.md` for:
- Detailed instructions
- Troubleshooting tips
- Customization options
- Example use cases

---

**That's it!** You now have a powerful dual-mode calculator. 🎯
