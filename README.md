# 💰 Staffing Calculator - Dual Mode

A comprehensive staffing calculator with two powerful modes:

## 🎯 Features

### 📊 Margin Mode (Original Calculator)
- **Budget-Based Optimization**: Enter your annual budget and target margin range
- **Smart Rate Calculation**: Automatically calculates optimal client rates
- **Margin Control**: Keeps average margin within your target range (55-60% default)
- **Individual Flexibility**: Each position can have margins between 10-65%
- **Discount Feature**: Apply client discounts and see updated margins
- **Financial Projections**: View monthly and annual revenue, costs, and profits

### ⚖️ Blended Rate Mode (New Feature)
- **Weighted Average Calculation**: Calculate blended rates across multiple roles
- **Rate Card Integration**: Pull rates directly from your Google Sheets rate card
- **Location Support**: Select onshore, offshore, or nearshore for each role
- **Automatic Cost Calculation**: See monthly and annual costs per role
- **Role Breakdown**: Detailed breakdown showing each role's contribution
- **Real-Time Updates**: Results update as you type

## 🚀 How to Use

### Margin Mode
1. Click **"📊 Margin Mode"** button
2. Enter your annual project budget
3. Set the number of positions you need
4. Choose your target margin range (e.g., 55-60%)
5. Click "Set Budget & Start Adding Positions"
6. Add positions with role, hours, and location
7. The calculator optimizes rates to hit your target margin
8. Optionally apply a client discount

### Blended Rate Mode
1. Click **"⚖️ Blended Rate"** button
2. Click "Add Another Role" to add positions
3. For each role:
   - Select the role from your rate card
   - Choose the location (onshore/offshore/nearshore)
   - Rate auto-fills from your rate card
   - Enter hours for the role
4. View the blended rate and breakdown instantly
5. Add or remove roles as needed

## 📋 Files Included

- `index.html` - Main HTML file with both modes
- `styles-enhanced.css` - Complete styling for both modes
- `script__2_.js` - Original margin mode logic
- `script-blended.js` - New blended rate mode logic
- `sheetsConfig__1_.js` - Google Sheets configuration
- `sheetsLoader__1_.js` - Google Sheets data loader
- `rateCardData.js` - Fallback rate card data

## 🔧 Setup Instructions

### 1. Google Sheets Setup (Required for Both Modes)

Your Google Sheet should have these columns:
- **Column A**: Role (e.g., "Senior Consultant")
- **Column B**: Onshore Cost/hr (e.g., 150)
- **Column C**: Offshore Cost/hr (e.g., 75)
- **Column D**: Nearshore Cost/hr (e.g., 100)

### 2. Configure Google Sheets Connection

Edit `sheetsConfig__1_.js`:
```javascript
const SHEETS_CONFIG = {
    SHEET_ID: 'YOUR_SHEET_ID_HERE',  // Get from your sheet URL
    API_KEY: '',  // Optional, leave empty for public sheets
    SHEET_NAME: 'Rate Card Data',  // Name of your sheet tab
    REFRESH_INTERVAL: 60000,  // 60 seconds
    AUTO_REFRESH: true
};
```

### 3. Deploy

Upload all files to your web hosting or GitHub Pages:
- All files must be in the same directory
- Make sure Google Sheet is public (Share → Anyone with link → Viewer)

## 💡 Tips

### For Margin Mode:
- Start with realistic target margins (55-60% is common)
- The calculator optimizes for average margin, not individual margins
- Use the discount feature to model client negotiations
- Watch the warnings if margins get too tight

### For Blended Rate Mode:
- Add roles in the order they appear in your project
- Use the breakdown to see which roles drive the blended rate
- Compare different location mixes to optimize costs
- The blended rate is useful for proposal pricing

## 🔄 Mode Switching

You can switch between modes at any time:
- Your data in each mode is preserved
- No data is shared between modes
- Each mode operates independently

## 📊 Example Use Cases

### Margin Mode Use Case:
**Scenario**: You have a $3.4M annual budget and need to staff 7 positions with 55-60% margin.

**Steps**:
1. Enter $3,400,000 budget
2. Enter 7 positions
3. Set 55-60% margin range
4. Add your positions (e.g., 2 Senior Consultants, 3 Consultants, 2 Developers)
5. Calculator shows optimal rates and achieves your target margin

### Blended Rate Mode Use Case:
**Scenario**: You need to quote a blended rate for a mixed team.

**Steps**:
1. Add Role 1: Senior Consultant, Onshore, 80 hours
2. Add Role 2: Developer, Offshore, 160 hours
3. Add Role 3: Business Analyst, Nearshore, 120 hours
4. View blended rate (e.g., $92.50/hour)
5. Use this rate for your proposal

## 🎨 Customization

The calculator uses CSS variables for easy theming:
```css
--primary: #2563eb;  /* Main blue color */
--success: #10b981;  /* Green for success */
--danger: #ef4444;   /* Red for errors */
```

## 📱 Mobile Responsive

Both modes are fully responsive and work great on:
- Desktop computers
- Tablets
- Mobile phones

## 🔐 Data Privacy

- All calculations happen in your browser
- No data is sent to external servers (except Google Sheets API)
- Google Sheets data is read-only
- Your budgets and rates stay private

## 🐛 Troubleshooting

**Google Sheets not loading?**
- Check if your sheet is public
- Verify the SHEET_ID in sheetsConfig__1_.js
- Make sure sheet tab name matches SHEET_NAME
- Check browser console for errors

**Blended rate not calculating?**
- Make sure both role and location are selected
- Verify hours are entered
- Check that rate card has data for that role/location combination

**Mode switching not working?**
- Clear browser cache
- Make sure all JavaScript files are loaded
- Check browser console for errors

## 📄 License

Free to use and modify for your business needs.

## 🙏 Support

For questions or issues:
1. Check the browser console for errors
2. Verify all files are uploaded correctly
3. Ensure Google Sheets is configured properly

---

**Version**: 2.0 (Dual Mode)  
**Last Updated**: November 2024  
**Compatibility**: All modern browsers (Chrome, Firefox, Safari, Edge)
