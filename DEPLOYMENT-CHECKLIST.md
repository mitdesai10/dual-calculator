# ✅ Deployment Checklist

## Pre-Deployment

### 1. Files Ready ✓
- [ ] index.html
- [ ] styles-enhanced.css
- [ ] script__2_.js (margin mode)
- [ ] script-blended.js (blended mode)
- [ ] sheetsConfig__1_.js
- [ ] sheetsLoader__1_.js
- [ ] rateCardData.js

### 2. Configuration ⚙️
- [ ] Update SHEET_ID in sheetsConfig__1_.js
- [ ] Verify Google Sheet is public
- [ ] Confirm sheet tab name is "Rate Card Data"
- [ ] Test sheet columns: Role | Onshore | Offshore | Nearshore

### 3. Testing Locally 🧪
- [ ] Open index.html in browser
- [ ] Test mode toggle (Margin ↔ Blended)
- [ ] Verify Google Sheets data loads
- [ ] Test Margin Mode:
  - [ ] Enter budget
  - [ ] Add positions
  - [ ] Check calculations
- [ ] Test Blended Rate Mode:
  - [ ] Add roles
  - [ ] Select locations
  - [ ] Verify rates auto-fill
  - [ ] Check blended rate calculation

---

## Deployment

### 4. Upload Files 📤
- [ ] Upload all 7 files to same directory
- [ ] Keep filenames exactly as provided
- [ ] Ensure proper file permissions (readable)

### 5. Web Server Configuration 🌐
- [ ] Files are in web-accessible directory
- [ ] index.html is accessible via URL
- [ ] All JavaScript files load (check browser console)
- [ ] CSS file loads correctly

---

## Post-Deployment

### 6. Smoke Testing 🔥
- [ ] Open deployed URL
- [ ] Margin mode loads
- [ ] Blended mode loads
- [ ] Mode toggle works
- [ ] Google Sheets data appears
- [ ] No console errors

### 7. Feature Testing 🎯

**Margin Mode:**
- [ ] Budget entry works
- [ ] Position counter works
- [ ] Margin range inputs work
- [ ] Add position form works
- [ ] Rate calculations correct
- [ ] Discount feature works

**Blended Rate Mode:**
- [ ] Add role button works
- [ ] Role dropdown populated
- [ ] Location dropdown works
- [ ] Rate auto-fills correctly
- [ ] Hours input works
- [ ] Monthly/annual costs calculate
- [ ] Blended rate updates
- [ ] Breakdown section displays
- [ ] Remove role works

### 8. Responsive Testing 📱
- [ ] Desktop layout looks good
- [ ] Tablet layout looks good
- [ ] Mobile layout looks good
- [ ] Mode toggle works on mobile
- [ ] All inputs accessible on mobile

### 9. Cross-Browser Testing 🌍
- [ ] Chrome ✓
- [ ] Firefox ✓
- [ ] Safari ✓
- [ ] Edge ✓

---

## Troubleshooting

### Google Sheets Not Loading?
- [ ] Check SHEET_ID is correct
- [ ] Verify sheet is public (Anyone with link → Viewer)
- [ ] Check sheet tab name matches config
- [ ] Look for CORS errors in console
- [ ] Try API key method if public access fails

### Calculations Wrong?
- [ ] Verify rate card data is correct
- [ ] Check column order in Google Sheet
- [ ] Ensure numbers (not text) in cost columns
- [ ] Clear browser cache and reload

### Layout Issues?
- [ ] Verify styles-enhanced.css loaded
- [ ] Check browser console for CSS errors
- [ ] Test in different browsers
- [ ] Clear browser cache

### Mode Toggle Not Working?
- [ ] Check script-blended.js loaded
- [ ] Verify no JavaScript errors in console
- [ ] Check mode button IDs match
- [ ] Ensure both mode content divs exist

---

## Production Checklist

### Performance ✨
- [ ] Page loads in < 2 seconds
- [ ] Google Sheets loads in < 3 seconds
- [ ] Mode switching is instant
- [ ] Calculations update in real-time

### User Experience 👥
- [ ] Instructions are clear
- [ ] Tooltips work (if any)
- [ ] Error messages are helpful
- [ ] Success feedback is visible

### Documentation 📚
- [ ] README.md uploaded
- [ ] QUICKSTART.md uploaded
- [ ] MODE-COMPARISON.md uploaded
- [ ] Team knows how to use both modes

---

## Maintenance

### Regular Checks 🔍
- [ ] Google Sheets still accessible
- [ ] No console errors
- [ ] Auto-refresh working (if enabled)
- [ ] Calculations still accurate

### Updates 🔄
- [ ] Rate card data updated in Google Sheets
- [ ] Config file updated if needed
- [ ] Documentation updated if features change

---

## Success Criteria ✅

Your deployment is successful when:

1. ✅ Both modes load without errors
2. ✅ Google Sheets data populates correctly
3. ✅ Mode toggle switches smoothly
4. ✅ Calculations are accurate
5. ✅ Responsive on all devices
6. ✅ Works in all major browsers
7. ✅ No console errors
8. ✅ Team can use both modes effectively

---

## Support Resources

- **Full Docs**: README.md
- **Quick Start**: QUICKSTART.md
- **Mode Guide**: MODE-COMPARISON.md
- **Summary**: SUMMARY.md

---

**Last Updated**: November 2024  
**Version**: 2.0 (Dual Mode)
