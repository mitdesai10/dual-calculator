// ========================================
// Rate Card Data (Fallback)
// ========================================
// This is backup data in case Google Sheets fails to load

let rateCardDataBackup = [
    {
        role: "Senior Consultant",
        onshore: { cost: 150 },
        offshore: { cost: 75 },
        nearshore: { cost: 100 }
    },
    {
        role: "Consultant",
        onshore: { cost: 120 },
        offshore: { cost: 60 },
        nearshore: { cost: 80 }
    },
    {
        role: "Associate Consultant",
        onshore: { cost: 90 },
        offshore: { cost: 45 },
        nearshore: { cost: 60 }
    },
    {
        role: "Project Manager",
        onshore: { cost: 160 },
        offshore: { cost: 80 },
        nearshore: { cost: 110 }
    },
    {
        role: "Business Analyst",
        onshore: { cost: 110 },
        offshore: { cost: 55 },
        nearshore: { cost: 75 }
    },
    {
        role: "Technical Architect",
        onshore: { cost: 180 },
        offshore: { cost: 90 },
        nearshore: { cost: 120 }
    },
    {
        role: "Developer",
        onshore: { cost: 130 },
        offshore: { cost: 65 },
        nearshore: { cost: 85 }
    }
];

// Initialize rateCardData with backup
if (typeof rateCardData === 'undefined') {
    var rateCardData = rateCardDataBackup;
}

console.log('Rate card data loaded:', rateCardData.length, 'roles');
