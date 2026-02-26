// ========================================
// Mode Management
// ========================================

let currentMode = 'margin'; // 'margin' or 'blended'

function switchMode(mode) {
    currentMode = mode;
    
    // Update button states
    const marginBtn = document.getElementById('marginModeBtn');
    const blendedBtn = document.getElementById('blendedModeBtn');
    
    if (mode === 'margin') {
        marginBtn.classList.add('active');
        blendedBtn.classList.remove('active');
        document.getElementById('marginModeContent').style.display = 'block';
        document.getElementById('blendedModeContent').style.display = 'none';
        document.getElementById('headerSubtitle').textContent = 'Enter annual budget → Add positions → Get optimized rates (avg margin in your target range)';
    } else {
        blendedBtn.classList.add('active');
        marginBtn.classList.remove('active');
        document.getElementById('marginModeContent').style.display = 'none';
        document.getElementById('blendedModeContent').style.display = 'block';
        document.getElementById('headerSubtitle').textContent = 'Calculate weighted average rates across multiple roles or resources';
    }
    
    console.log(`Switched to ${mode} mode`);
}

// ========================================
// Blended Rate Mode State
// ========================================

let blendedRoleCounter = 0;

// ========================================
// Blended Rate Mode Functions
// ========================================

function addBlendedRole() {
    blendedRoleCounter++;
    const container = document.getElementById('blendedRolesContainer');
    
    const roleDiv = document.createElement('div');
    roleDiv.className = 'role-item';
    roleDiv.id = `blended-role-${blendedRoleCounter}`;
    roleDiv.dataset.roleId = blendedRoleCounter;
    
    // Build options from rate card data
    let roleOptions = '<option value="">Select role from rate card...</option>';
    if (typeof rateCardData !== 'undefined' && rateCardData.length > 0) {
        rateCardData.forEach(role => {
            roleOptions += `<option value="${role.role}">${role.role}</option>`;
        });
    }
    
    roleDiv.innerHTML = `
        <div class="role-header">
            <span class="role-label">Role #${blendedRoleCounter}</span>
            <button class="remove-btn" onclick="removeBlendedRole(${blendedRoleCounter})">Remove</button>
        </div>
        <div class="input-row">
            <div class="input-group">
                <label for="blended-role-select-${blendedRoleCounter}">Role</label>
                <select id="blended-role-select-${blendedRoleCounter}" class="form-control" onchange="handleBlendedRoleChange(${blendedRoleCounter})">
                    ${roleOptions}
                </select>
            </div>
            <div class="input-group">
                <label for="blended-location-${blendedRoleCounter}">Location</label>
                <select id="blended-location-${blendedRoleCounter}" class="form-control" onchange="handleBlendedLocationChange(${blendedRoleCounter})">
                    <option value="">Select location...</option>
                    <option value="onshore">Onshore</option>
                    <option value="offshore">Offshore</option>
                    <option value="nearshore">Nearshore</option>
                </select>
            </div>
            <div class="input-group">
                <label for="blended-rate-${blendedRoleCounter}">Rate ($/hour)</label>
                <input type="number" id="blended-rate-${blendedRoleCounter}" placeholder="150.00" step="0.01" min="0" oninput="calculateBlendedRate()" readonly>
            </div>
        </div>
        <div class="input-row" style="margin-top: 10px;">
            <div class="input-group">
                <label for="blended-hours-${blendedRoleCounter}">Hours</label>
                <input type="number" id="blended-hours-${blendedRoleCounter}" placeholder="173" step="0.5" min="0" oninput="calculateBlendedRate()">
            </div>
            <div class="input-group">
                <label>Monthly Cost</label>
                <input type="text" id="blended-monthly-cost-${blendedRoleCounter}" class="form-control" readonly style="background: #f0f0f0;" value="$0.00">
            </div>
            <div class="input-group">
                <label>Annual Cost</label>
                <input type="text" id="blended-annual-cost-${blendedRoleCounter}" class="form-control" readonly style="background: #f0f0f0;" value="$0.00">
            </div>
        </div>
    `;
    
    container.appendChild(roleDiv);
    calculateBlendedRate();
}

function removeBlendedRole(id) {
    const roleElement = document.getElementById(`blended-role-${id}`);
    if (roleElement) {
        roleElement.remove();
        calculateBlendedRate();
    }
}

function handleBlendedRoleChange(roleId) {
    const roleSelect = document.getElementById(`blended-role-select-${roleId}`);
    const locationSelect = document.getElementById(`blended-location-${roleId}`);
    const rateInput = document.getElementById(`blended-rate-${roleId}`);
    
    const selectedRole = roleSelect.value;
    const selectedLocation = locationSelect.value;
    
    if (selectedRole && selectedLocation) {
        updateBlendedRoleRate(roleId, selectedRole, selectedLocation);
    }
}

function handleBlendedLocationChange(roleId) {
    const roleSelect = document.getElementById(`blended-role-select-${roleId}`);
    const locationSelect = document.getElementById(`blended-location-${roleId}`);
    
    const selectedRole = roleSelect.value;
    const selectedLocation = locationSelect.value;
    
    if (selectedRole && selectedLocation) {
        updateBlendedRoleRate(roleId, selectedRole, selectedLocation);
    }
}

function updateBlendedRoleRate(roleId, roleName, location) {
    const rateInput = document.getElementById(`blended-rate-${roleId}`);
    const hoursInput = document.getElementById(`blended-hours-${roleId}`);
    const monthlyCostInput = document.getElementById(`blended-monthly-cost-${roleId}`);
    const annualCostInput = document.getElementById(`blended-annual-cost-${roleId}`);
    
    // Find the role in rate card data
    if (typeof rateCardData !== 'undefined') {
        const roleData = rateCardData.find(r => r.role === roleName);
        if (roleData && roleData[location]) {
            const rate = roleData[location].cost;
            rateInput.value = rate.toFixed(2);
            
            // Calculate costs if hours are entered
            const hours = parseFloat(hoursInput.value) || 0;
            if (hours > 0) {
                const monthlyCost = rate * hours;
                const annualCost = monthlyCost * 12;
                monthlyCostInput.value = `$${monthlyCost.toFixed(2)}`;
                annualCostInput.value = `$${annualCost.toFixed(2)}`;
            }
            
            calculateBlendedRate();
        }
    }
}

function calculateBlendedRate() {
    const roles = document.querySelectorAll('.role-item');
    let totalWeightedCost = 0;
    let totalHours = 0;
    let activeRoles = 0;
    const breakdownData = [];

    roles.forEach(role => {
        const roleId = role.dataset.roleId;
        const roleSelect = document.getElementById(`blended-role-select-${roleId}`);
        const rateInput = document.getElementById(`blended-rate-${roleId}`);
        const hoursInput = document.getElementById(`blended-hours-${roleId}`);
        const monthlyCostInput = document.getElementById(`blended-monthly-cost-${roleId}`);
        const annualCostInput = document.getElementById(`blended-annual-cost-${roleId}`);

        const name = roleSelect ? (roleSelect.options[roleSelect.selectedIndex]?.text || `Role #${roleId}`) : `Role #${roleId}`;
        const rate = parseFloat(rateInput?.value) || 0;
        const hours = parseFloat(hoursInput?.value) || 0;

        // Update monthly and annual costs
        if (rate > 0 && hours > 0) {
            const monthlyCost = rate * hours;
            const annualCost = monthlyCost * 12;
            if (monthlyCostInput) monthlyCostInput.value = `$${monthlyCost.toFixed(2)}`;
            if (annualCostInput) annualCostInput.value = `$${annualCost.toFixed(2)}`;
            
            const cost = rate * hours;
            totalWeightedCost += cost;
            totalHours += hours;
            activeRoles++;

            breakdownData.push({
                name: name,
                rate: rate,
                hours: hours,
                cost: cost
            });
        } else {
            if (monthlyCostInput) monthlyCostInput.value = '$0.00';
            if (annualCostInput) annualCostInput.value = '$0.00';
        }
    });

    const blendedRate = totalHours > 0 ? totalWeightedCost / totalHours : 0;

    // Update main results
    document.getElementById('blendedRateValue').textContent = `$${blendedRate.toFixed(2)}`;
    document.getElementById('blendedTotalHours').textContent = totalHours.toFixed(1);
    document.getElementById('blendedTotalCost').textContent = `$${totalWeightedCost.toFixed(2)}`;
    document.getElementById('blendedRoleCount').textContent = activeRoles;

    // Update breakdown
    const breakdownSection = document.getElementById('blendedBreakdownSection');
    const breakdownContainer = document.getElementById('blendedBreakdownContainer');

    if (breakdownData.length > 0) {
        breakdownSection.style.display = 'block';
        breakdownContainer.innerHTML = breakdownData.map(role => `
            <div class="breakdown-item">
                <div>
                    <div class="breakdown-item-name">${role.name}</div>
                    <div style="font-size: 12px; opacity: 0.8; margin-top: 2px;">
                        $${role.rate.toFixed(2)}/hr × ${role.hours} hrs
                    </div>
                </div>
                <div class="breakdown-item-value">$${role.cost.toFixed(2)}</div>
            </div>
        `).join('');
    } else {
        breakdownSection.style.display = 'none';
    }

    // Show/hide margin section based on whether we have data
    const marginSection = document.getElementById('blendedMarginSection');
    const exportButtons = document.getElementById('exportButtons');
    
    if (activeRoles > 0 && totalHours > 0) {
        marginSection.style.display = 'block';
        // Don't show export buttons yet - only after margin is calculated
        // Recalculate margin if already entered
        calculateBlendedMargin();
    } else {
        marginSection.style.display = 'none';
        exportButtons.style.display = 'none';
    }
}

function calculateBlendedMargin() {
    const targetMarginPercent = parseFloat(document.getElementById('blendedTargetMargin')?.value) || 0;
    
    if (targetMarginPercent <= 0) {
        document.getElementById('blendedMarginResults').style.display = 'none';
        document.getElementById('exportButtons').style.display = 'none';
        return;
    }

    // Get blended cost rate and total hours
    const blendedCostRate = parseFloat(document.getElementById('blendedRateValue').textContent.replace('$', '')) || 0;
    const totalHours = parseFloat(document.getElementById('blendedTotalHours').textContent) || 0;
    const totalCost = parseFloat(document.getElementById('blendedTotalCost').textContent.replace('$', '')) || 0;

    if (blendedCostRate === 0 || totalHours === 0) {
        return;
    }

    // Calculate client charge rate based on margin
    // Formula: ChargeRate = Cost / (1 - Margin)
    const targetMargin = targetMarginPercent / 100;
    const chargeRate = blendedCostRate / (1 - targetMargin);
    const revenue = chargeRate;
    const profit = chargeRate - blendedCostRate;

    // Calculate totals
    const monthlyCost = totalCost;
    const monthlyRevenue = chargeRate * totalHours;
    const monthlyProfit = monthlyRevenue - monthlyCost;
    
    const annualCost = monthlyCost * 12;
    const annualRevenue = monthlyRevenue * 12;
    const annualProfit = monthlyProfit * 12;

    // Update display
    document.getElementById('blendedChargeRate').textContent = `$${chargeRate.toFixed(2)}`;
    document.getElementById('marginBlendedCost').textContent = `$${blendedCostRate.toFixed(2)}/hr`;
    document.getElementById('marginBlendedRevenue').textContent = `$${revenue.toFixed(2)}/hr`;
    document.getElementById('marginBlendedProfit').textContent = `$${profit.toFixed(2)}/hr`;
    document.getElementById('marginBlendedPercent').textContent = `${targetMarginPercent.toFixed(0)}%`;

    // Update project totals
    document.getElementById('blendedMonthlyCost').textContent = `$${monthlyCost.toFixed(2)}`;
    document.getElementById('blendedMonthlyRevenue').textContent = `$${monthlyRevenue.toFixed(2)}`;
    document.getElementById('blendedMonthlyProfit').textContent = `$${monthlyProfit.toFixed(2)}`;
    
    document.getElementById('blendedAnnualCost').textContent = `$${annualCost.toFixed(2)}`;
    document.getElementById('blendedAnnualRevenue').textContent = `$${annualRevenue.toFixed(2)}`;
    document.getElementById('blendedAnnualProfit').textContent = `$${annualProfit.toFixed(2)}`;

    document.getElementById('blendedMarginResults').style.display = 'block';
    
    // Show export buttons when margin is calculated
    document.getElementById('exportButtons').style.display = 'flex';
}

// ========================================
// Initialize Blended Mode
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for rate card data to load
    setTimeout(() => {
        // Add one initial role in blended mode
        addBlendedRole();
    }, 1000);
});

// Make functions globally accessible
window.switchMode = switchMode;
window.addBlendedRole = addBlendedRole;
window.removeBlendedRole = removeBlendedRole;
window.handleBlendedRoleChange = handleBlendedRoleChange;
window.handleBlendedLocationChange = handleBlendedLocationChange;
window.calculateBlendedRate = calculateBlendedRate;
window.calculateBlendedMargin = calculateBlendedMargin;

// ========================================
// Export Functions
// ========================================

function exportToCSV() {
    const roles = document.querySelectorAll('.role-item');
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Header row
    csvContent += "Role,Location,Rate ($/hr),Hours,Monthly Cost,Annual Cost\n";
    
    // Data rows
    roles.forEach(role => {
        const roleId = role.dataset.roleId;
        const roleSelect = document.getElementById(`blended-role-select-${roleId}`);
        const locationSelect = document.getElementById(`blended-location-${roleId}`);
        const rateInput = document.getElementById(`blended-rate-${roleId}`);
        const hoursInput = document.getElementById(`blended-hours-${roleId}`);
        
        const roleName = roleSelect ? (roleSelect.options[roleSelect.selectedIndex]?.text || '') : '';
        const location = locationSelect ? (locationSelect.options[locationSelect.selectedIndex]?.text || '') : '';
        const rate = parseFloat(rateInput?.value) || 0;
        const hours = parseFloat(hoursInput?.value) || 0;
        
        if (roleName && rate > 0 && hours > 0) {
            const monthlyCost = rate * hours;
            const annualCost = monthlyCost * 12;
            
            csvContent += `"${roleName}","${location}",${rate},${hours},${monthlyCost.toFixed(2)},${annualCost.toFixed(2)}\n`;
        }
    });
    
    // Summary rows
    const blendedRate = parseFloat(document.getElementById('blendedRateValue').textContent.replace('$', '')) || 0;
    const totalHours = parseFloat(document.getElementById('blendedTotalHours').textContent) || 0;
    const totalCost = parseFloat(document.getElementById('blendedTotalCost').textContent.replace('$', '')) || 0;
    
    csvContent += "\n";
    csvContent += "Summary\n";
    csvContent += `"Blended Cost Rate ($/hr)",,,${blendedRate.toFixed(2)}\n`;
    csvContent += `"Total Hours",,,${totalHours}\n`;
    csvContent += `"Total Monthly Cost",,,${totalCost.toFixed(2)}\n`;
    csvContent += `"Total Annual Cost",,,${(totalCost * 12).toFixed(2)}\n`;
    
    // Check if margin is calculated
    const marginInput = document.getElementById('blendedTargetMargin');
    const targetMargin = parseFloat(marginInput?.value) || 0;
    
    if (targetMargin > 0) {
        csvContent += "\n";
        csvContent += "Margin Calculation\n";
        csvContent += `"Target Margin (%)",,,${targetMargin}\n`;
        
        const chargeRate = parseFloat(document.getElementById('blendedChargeRate')?.textContent.replace('$', '')) || 0;
        const monthlyRevenue = parseFloat(document.getElementById('blendedMonthlyRevenue')?.textContent.replace('$', '').replace(',', '')) || 0;
        const monthlyProfit = parseFloat(document.getElementById('blendedMonthlyProfit')?.textContent.replace('$', '').replace(',', '')) || 0;
        const annualRevenue = parseFloat(document.getElementById('blendedAnnualRevenue')?.textContent.replace('$', '').replace(',', '')) || 0;
        const annualProfit = parseFloat(document.getElementById('blendedAnnualProfit')?.textContent.replace('$', '').replace(',', '')) || 0;
        
        csvContent += `"Client Charge Rate ($/hr)",,,${chargeRate.toFixed(2)}\n`;
        csvContent += `"Monthly Revenue",,,${monthlyRevenue.toFixed(2)}\n`;
        csvContent += `"Monthly Profit",,,${monthlyProfit.toFixed(2)}\n`;
        csvContent += `"Annual Revenue",,,${annualRevenue.toFixed(2)}\n`;
        csvContent += `"Annual Profit",,,${annualProfit.toFixed(2)}\n`;
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

function exportToExcel() {
    const roles = document.querySelectorAll('.role-item');
    
    // Build HTML table
    let tableHTML = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="utf-8">
            <!--[if gte mso 9]>
            <xml>
                <x:ExcelWorkbook>
                    <x:ExcelWorksheets>
                        <x:ExcelWorksheet>
                            <x:Name>Quote</x:Name>
                            <x:WorksheetOptions>
                                <x:DisplayGridlines/>
                            </x:WorksheetOptions>
                        </x:ExcelWorksheet>
                    </x:ExcelWorksheets>
                </x:ExcelWorkbook>
            </xml>
            <![endif]-->
            <style>
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #4472C4; color: white; font-weight: bold; }
                .summary-header { background-color: #70AD47; color: white; font-weight: bold; }
                .total-row { background-color: #F2F2F2; font-weight: bold; }
            </style>
        </head>
        <body>
            <h2>Staffing Quote - ${new Date().toLocaleDateString()}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Role</th>
                        <th>Location</th>
                        <th>Rate ($/hr)</th>
                        <th>Hours</th>
                        <th>Monthly Cost</th>
                        <th>Annual Cost</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Add role data
    roles.forEach(role => {
        const roleId = role.dataset.roleId;
        const roleSelect = document.getElementById(`blended-role-select-${roleId}`);
        const locationSelect = document.getElementById(`blended-location-${roleId}`);
        const rateInput = document.getElementById(`blended-rate-${roleId}`);
        const hoursInput = document.getElementById(`blended-hours-${roleId}`);
        
        const roleName = roleSelect ? (roleSelect.options[roleSelect.selectedIndex]?.text || '') : '';
        const location = locationSelect ? (locationSelect.options[locationSelect.selectedIndex]?.text || '') : '';
        const rate = parseFloat(rateInput?.value) || 0;
        const hours = parseFloat(hoursInput?.value) || 0;
        
        if (roleName && rate > 0 && hours > 0) {
            const monthlyCost = rate * hours;
            const annualCost = monthlyCost * 12;
            
            tableHTML += `
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
    
    // Summary section
    const blendedRate = parseFloat(document.getElementById('blendedRateValue').textContent.replace('$', '')) || 0;
    const totalHours = parseFloat(document.getElementById('blendedTotalHours').textContent) || 0;
    const totalCost = parseFloat(document.getElementById('blendedTotalCost').textContent.replace('$', '')) || 0;
    
    tableHTML += `
                </tbody>
            </table>
            <br>
            <table>
                <thead>
                    <tr>
                        <th colspan="2" class="summary-header">Summary</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Blended Cost Rate ($/hr)</strong></td>
                        <td>$${blendedRate.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td><strong>Total Hours</strong></td>
                        <td>${totalHours}</td>
                    </tr>
                    <tr class="total-row">
                        <td><strong>Total Monthly Cost</strong></td>
                        <td>$${totalCost.toFixed(2)}</td>
                    </tr>
                    <tr class="total-row">
                        <td><strong>Total Annual Cost</strong></td>
                        <td>$${(totalCost * 12).toFixed(2)}</td>
                    </tr>
    `;
    
    // Check if margin is calculated
    const marginInput = document.getElementById('blendedTargetMargin');
    const targetMargin = parseFloat(marginInput?.value) || 0;
    
    if (targetMargin > 0) {
        const chargeRate = parseFloat(document.getElementById('blendedChargeRate')?.textContent.replace('$', '')) || 0;
        const monthlyRevenue = parseFloat(document.getElementById('blendedMonthlyRevenue')?.textContent.replace('$', '').replace(',', '')) || 0;
        const monthlyProfit = parseFloat(document.getElementById('blendedMonthlyProfit')?.textContent.replace('$', '').replace(',', '')) || 0;
        const annualRevenue = parseFloat(document.getElementById('blendedAnnualRevenue')?.textContent.replace('$', '').replace(',', '')) || 0;
        const annualProfit = parseFloat(document.getElementById('blendedAnnualProfit')?.textContent.replace('$', '').replace(',', '')) || 0;
        
        tableHTML += `
                </tbody>
            </table>
            <br>
            <table>
                <thead>
                    <tr>
                        <th colspan="2" class="summary-header">Margin Calculation (${targetMargin}% Margin)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Client Charge Rate ($/hr)</strong></td>
                        <td>$${chargeRate.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td><strong>Profit per Hour</strong></td>
                        <td>$${(chargeRate - blendedRate).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td><strong>Monthly Revenue</strong></td>
                        <td>$${monthlyRevenue.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td><strong>Monthly Profit</strong></td>
                        <td>$${monthlyProfit.toFixed(2)}</td>
                    </tr>
                    <tr class="total-row">
                        <td><strong>Annual Revenue</strong></td>
                        <td>$${annualRevenue.toFixed(2)}</td>
                    </tr>
                    <tr class="total-row">
                        <td><strong>Annual Profit</strong></td>
                        <td>$${annualProfit.toFixed(2)}</td>
                    </tr>
        `;
    }
    
    tableHTML += `
                </tbody>
            </table>
        </body>
        </html>
    `;
    
    // Create download link
    const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `quote_${new Date().toISOString().split('T')[0]}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Make export functions globally accessible
window.exportToCSV = exportToCSV;
window.exportToExcel = exportToExcel;

