// ========================================
// Export Functions - PDF and CSV
// ========================================

function exportToCSV() {
    const roles = document.querySelectorAll('.role-item');
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add title and date
    csvContent += `Staffing Quote - ${new Date().toLocaleDateString()}\n\n`;
    
    // Header row for roles
    csvContent += "TEAM COMPOSITION\n";
    csvContent += "Role,Location,Cost Rate ($/hr),Hours,Monthly Cost,Annual Cost\n";
    
    // Data rows
    roles.forEach(role => {
        const roleId = role.dataset.roleId;
        const roleSelect = document.getElementById(`blended-role-select-${roleId}`);
        const locationSelect = document.getElementById(`blended-location-${roleId}`);
        const rateInput = document.getElementById(`blended-rate-${roleId}`);
        const hoursInput = document.getElementById(`blended-hours-${roleId}`);
        
        const roleName = roleSelect ? (roleSelect.options[roleSelect.selectedIndex]?.text || '') : '';
        const locationText = locationSelect ? (locationSelect.options[locationSelect.selectedIndex]?.text || '') : '';
        // Clean up location text - remove any emojis
        const location = locationText.replace(/[^\w\s]/gi, '').trim();
        const rate = parseFloat(rateInput?.value) || 0;
        const hours = parseFloat(hoursInput?.value) || 0;
        
        if (roleName && rate > 0 && hours > 0) {
            const monthlyCost = rate * hours;
            const annualCost = monthlyCost * 12;
            
            csvContent += `"${roleName}","${location}",${rate.toFixed(2)},${hours},${monthlyCost.toFixed(2)},${annualCost.toFixed(2)}\n`;
        }
    });
    
    // Summary section
    const blendedRate = parseFloat(document.getElementById('blendedRateValue').textContent.replace('$', '')) || 0;
    const totalHours = parseFloat(document.getElementById('blendedTotalHours').textContent) || 0;
    const totalCost = parseFloat(document.getElementById('blendedTotalCost').textContent.replace('$', '')) || 0;
    
    csvContent += "\n";
    csvContent += "COST SUMMARY\n";
    csvContent += `Blended Cost Rate ($/hr),${blendedRate.toFixed(2)}\n`;
    csvContent += `Total Hours,${totalHours}\n`;
    csvContent += `Total Monthly Cost,${totalCost.toFixed(2)}\n`;
    csvContent += `Total Annual Cost,${(totalCost * 12).toFixed(2)}\n`;
    
    // Check if margin is calculated
    const marginInput = document.getElementById('blendedTargetMargin');
    const targetMargin = parseFloat(marginInput?.value) || 0;
    
    if (targetMargin > 0) {
        csvContent += "\n";
        csvContent += "PRICING WITH MARGIN\n";
        csvContent += `Target Margin (%),${targetMargin}\n`;
        
        const chargeRate = parseFloat(document.getElementById('blendedChargeRate')?.textContent.replace('$', '')) || 0;
        
        csvContent += "\n";
        csvContent += "CLIENT PRICING\n";
        csvContent += "Role,Location,Cost Rate ($/hr),Client Rate ($/hr),Hours,Monthly Revenue,Annual Revenue\n";
        
        // Add each role with client rates
        roles.forEach(role => {
            const roleId = role.dataset.roleId;
            const roleSelect = document.getElementById(`blended-role-select-${roleId}`);
            const locationSelect = document.getElementById(`blended-location-${roleId}`);
            const rateInput = document.getElementById(`blended-rate-${roleId}`);
            const hoursInput = document.getElementById(`blended-hours-${roleId}`);
            
            const roleName = roleSelect ? (roleSelect.options[roleSelect.selectedIndex]?.text || '') : '';
            const locationText = locationSelect ? (locationSelect.options[locationSelect.selectedIndex]?.text || '') : '';
            const location = locationText.replace(/[^\w\s]/gi, '').trim();
            const costRate = parseFloat(rateInput?.value) || 0;
            const hours = parseFloat(hoursInput?.value) || 0;
            
            if (roleName && costRate > 0 && hours > 0) {
                const clientRate = costRate / (1 - (targetMargin / 100));
                const monthlyRevenue = clientRate * hours;
                const annualRevenue = monthlyRevenue * 12;
                
                csvContent += `"${roleName}","${location}",${costRate.toFixed(2)},${clientRate.toFixed(2)},${hours},${monthlyRevenue.toFixed(2)},${annualRevenue.toFixed(2)}\n`;
            }
        });
        
        const monthlyRevenue = parseFloat(document.getElementById('blendedMonthlyRevenue')?.textContent.replace(/[$,]/g, '')) || 0;
        const monthlyProfit = parseFloat(document.getElementById('blendedMonthlyProfit')?.textContent.replace(/[$,]/g, '')) || 0;
        const annualRevenue = parseFloat(document.getElementById('blendedAnnualRevenue')?.textContent.replace(/[$,]/g, '')) || 0;
        const annualProfit = parseFloat(document.getElementById('blendedAnnualProfit')?.textContent.replace(/[$,]/g, '')) || 0;
        
        csvContent += "\n";
        csvContent += "REVENUE SUMMARY\n";
        csvContent += `Blended Client Rate ($/hr),${chargeRate.toFixed(2)}\n`;
        csvContent += `Monthly Revenue,${monthlyRevenue.toFixed(2)}\n`;
        csvContent += `Monthly Cost,${totalCost.toFixed(2)}\n`;
        csvContent += `Monthly Profit,${monthlyProfit.toFixed(2)}\n`;
        csvContent += `Annual Revenue,${annualRevenue.toFixed(2)}\n`;
        csvContent += `Annual Cost,${(totalCost * 12).toFixed(2)}\n`;
        csvContent += `Annual Profit,${annualProfit.toFixed(2)}\n`;
        csvContent += `Effective Margin (%),${targetMargin}\n`;
    }
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `quote_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportToPDF() {
    // We'll use window.print() with custom CSS to generate PDF
    // Create a new window with printable content
    const roles = document.querySelectorAll('.role-item');
    
    const blendedRate = parseFloat(document.getElementById('blendedRateValue').textContent.replace('$', '')) || 0;
    const totalHours = parseFloat(document.getElementById('blendedTotalHours').textContent) || 0;
    const totalCost = parseFloat(document.getElementById('blendedTotalCost').textContent.replace('$', '')) || 0;
    
    const marginInput = document.getElementById('blendedTargetMargin');
    const targetMargin = parseFloat(marginInput?.value) || 0;
    
    let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Staffing Quote - ${new Date().toLocaleDateString()}</title>
        <style>
            @media print {
                @page { margin: 0.5in; }
                body { margin: 0; }
            }
            body {
                font-family: Arial, sans-serif;
                padding: 20px;
                max-width: 800px;
                margin: 0 auto;
            }
            h1 {
                color: #2563eb;
                border-bottom: 3px solid #2563eb;
                padding-bottom: 10px;
            }
            h2 {
                color: #1e40af;
                margin-top: 30px;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 5px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 12px 8px;
                text-align: left;
            }
            th {
                background-color: #2563eb;
                color: white;
                font-weight: bold;
            }
            tr:nth-child(even) {
                background-color: #f9fafb;
            }
            .summary-table th {
                background-color: #10b981;
            }
            .total-row {
                background-color: #e5e7eb;
                font-weight: bold;
            }
            .header-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                padding: 15px;
                background: #f3f4f6;
                border-radius: 8px;
            }
            .metric {
                text-align: center;
            }
            .metric-label {
                font-size: 12px;
                color: #6b7280;
                text-transform: uppercase;
            }
            .metric-value {
                font-size: 20px;
                font-weight: bold;
                color: #2563eb;
            }
            @media print {
                button { display: none; }
            }
            .print-button {
                background: #2563eb;
                color: white;
                border: none;
                padding: 12px 24px;
                font-size: 16px;
                border-radius: 6px;
                cursor: pointer;
                margin: 20px 0;
            }
            .print-button:hover {
                background: #1e40af;
            }
        </style>
    </head>
    <body>
        <h1>Staffing Quote</h1>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        
        <div class="header-info">
            <div class="metric">
                <div class="metric-label">Blended Cost Rate</div>
                <div class="metric-value">$${blendedRate.toFixed(2)}/hr</div>
            </div>
            <div class="metric">
                <div class="metric-label">Total Hours</div>
                <div class="metric-value">${totalHours}</div>
            </div>
            <div class="metric">
                <div class="metric-label">Monthly Cost</div>
                <div class="metric-value">$${totalCost.toFixed(2)}</div>
            </div>
        </div>
        
        <h2>Team Composition</h2>
        <table>
            <thead>
                <tr>
                    <th>Role</th>
                    <th>Location</th>
                    <th>Cost Rate ($/hr)</th>
                    <th>Hours</th>
                    <th>Monthly Cost</th>
                    <th>Annual Cost</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Add role rows
    roles.forEach(role => {
        const roleId = role.dataset.roleId;
        const roleSelect = document.getElementById(`blended-role-select-${roleId}`);
        const locationSelect = document.getElementById(`blended-location-${roleId}`);
        const rateInput = document.getElementById(`blended-rate-${roleId}`);
        const hoursInput = document.getElementById(`blended-hours-${roleId}`);
        
        const roleName = roleSelect ? (roleSelect.options[roleSelect.selectedIndex]?.text || '') : '';
        const locationText = locationSelect ? (locationSelect.options[locationSelect.selectedIndex]?.text || '') : '';
        const location = locationText.replace(/[^\w\s]/gi, '').trim();
        const rate = parseFloat(rateInput?.value) || 0;
        const hours = parseFloat(hoursInput?.value) || 0;
        
        if (roleName && rate > 0 && hours > 0) {
            const monthlyCost = rate * hours;
            const annualCost = monthlyCost * 12;
            
            htmlContent += `
                <tr>
                    <td>${roleName}</td>
                    <td>${location}</td>
                    <td>$${rate.toFixed(2)}</td>
                    <td>${hours}</td>
                    <td>$${monthlyCost.toFixed(2)}</td>
                    <td>$${annualCost.toFixed(2)}</td>
                </tr>
            `;
        }
    });
    
    htmlContent += `
                <tr class="total-row">
                    <td colspan="3"><strong>TOTAL</strong></td>
                    <td><strong>${totalHours}</strong></td>
                    <td><strong>$${totalCost.toFixed(2)}</strong></td>
                    <td><strong>$${(totalCost * 12).toFixed(2)}</strong></td>
                </tr>
            </tbody>
        </table>
    `;
    
    // Add margin section if applicable
    if (targetMargin > 0) {
        const chargeRate = parseFloat(document.getElementById('blendedChargeRate')?.textContent.replace('$', '')) || 0;
        const monthlyRevenue = parseFloat(document.getElementById('blendedMonthlyRevenue')?.textContent.replace(/[$,]/g, '')) || 0;
        const monthlyProfit = parseFloat(document.getElementById('blendedMonthlyProfit')?.textContent.replace(/[$,]/g, '')) || 0;
        const annualRevenue = parseFloat(document.getElementById('blendedAnnualRevenue')?.textContent.replace(/[$,]/g, '')) || 0;
        const annualProfit = parseFloat(document.getElementById('blendedAnnualProfit')?.textContent.replace(/[$,]/g, '')) || 0;
        
        htmlContent += `
        <h2>Client Pricing (${targetMargin}% Margin)</h2>
        <table>
            <thead>
                <tr>
                    <th>Role</th>
                    <th>Location</th>
                    <th>Cost Rate ($/hr)</th>
                    <th>Client Rate ($/hr)</th>
                    <th>Hours</th>
                    <th>Monthly Revenue</th>
                    <th>Annual Revenue</th>
                </tr>
            </thead>
            <tbody>
        `;
        
        // Add each role with client rates
        roles.forEach(role => {
            const roleId = role.dataset.roleId;
            const roleSelect = document.getElementById(`blended-role-select-${roleId}`);
            const locationSelect = document.getElementById(`blended-location-${roleId}`);
            const rateInput = document.getElementById(`blended-rate-${roleId}`);
            const hoursInput = document.getElementById(`blended-hours-${roleId}`);
            
            const roleName = roleSelect ? (roleSelect.options[roleSelect.selectedIndex]?.text || '') : '';
            const locationText = locationSelect ? (locationSelect.options[locationSelect.selectedIndex]?.text || '') : '';
            const location = locationText.replace(/[^\w\s]/gi, '').trim();
            const costRate = parseFloat(rateInput?.value) || 0;
            const hours = parseFloat(hoursInput?.value) || 0;
            
            if (roleName && costRate > 0 && hours > 0) {
                const clientRate = costRate / (1 - (targetMargin / 100));
                const monthlyRev = clientRate * hours;
                const annualRev = monthlyRev * 12;
                
                htmlContent += `
                    <tr>
                        <td>${roleName}</td>
                        <td>${location}</td>
                        <td>$${costRate.toFixed(2)}</td>
                        <td>$${clientRate.toFixed(2)}</td>
                        <td>${hours}</td>
                        <td>$${monthlyRev.toFixed(2)}</td>
                        <td>$${annualRev.toFixed(2)}</td>
                    </tr>
                `;
            }
        });
        
        htmlContent += `
                <tr class="total-row">
                    <td colspan="4"><strong>BLENDED CLIENT RATE: $${chargeRate.toFixed(2)}/hr</strong></td>
                    <td><strong>${totalHours}</strong></td>
                    <td><strong>$${monthlyRevenue.toFixed(2)}</strong></td>
                    <td><strong>$${annualRevenue.toFixed(2)}</strong></td>
                </tr>
            </tbody>
        </table>
        
        <h2>Financial Summary</h2>
        <table class="summary-table">
            <thead>
                <tr>
                    <th>Metric</th>
                    <th>Monthly</th>
                    <th>Annual</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Revenue</strong></td>
                    <td>$${monthlyRevenue.toFixed(2)}</td>
                    <td>$${annualRevenue.toFixed(2)}</td>
                </tr>
                <tr>
                    <td><strong>Cost</strong></td>
                    <td>$${totalCost.toFixed(2)}</td>
                    <td>$${(totalCost * 12).toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                    <td><strong>Profit (${targetMargin}% Margin)</strong></td>
                    <td><strong>$${monthlyProfit.toFixed(2)}</strong></td>
                    <td><strong>$${annualProfit.toFixed(2)}</strong></td>
                </tr>
            </tbody>
        </table>
        `;
    }
    
    htmlContent += `
        <button class="print-button" onclick="window.print()">Print / Save as PDF</button>
        <p style="text-align: center; color: #6b7280; margin-top: 40px; font-size: 12px;">
            Generated on ${new Date().toLocaleString()}
        </p>
    </body>
    </html>
    `;
    
    // Open in new window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
}

// Make export functions globally accessible
window.exportToCSV = exportToCSV;
window.exportToPDF = exportToPDF;

