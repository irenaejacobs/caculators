let chart;

// Compound Interest Calculator
function calculateCompoundInterest() {
    const principal = parseFloat(document.getElementById('principal').value.replace(/,/g, ''));
    const annualRate = parseFloat(document.getElementById('rate').value.replace(/,/g, '')) / 100;
    const compoundingFrequency = parseInt(document.getElementById('frequency').value);
    const years = parseFloat(document.getElementById('years').value.replace(/,/g, ''));
    const contribution = parseFloat(document.getElementById('contribution').value.replace(/,/g, ''));

    if (isNaN(principal) || isNaN(annualRate) || isNaN(compoundingFrequency) || isNaN(years) || isNaN(contribution)) {
        document.getElementById('result').innerText = "Please enter valid numbers.";
        return;
    }

    let futureValue;
    let totalInterest;
    let totalContributions = 0;

    const data = [];
    let amount = principal;

    const totalPeriods = years * compoundingFrequency;
    const periodRate = annualRate / compoundingFrequency;

    for (let i = 0; i <= totalPeriods; i++) {
        if (i > 0) {
            amount += contribution;
            totalContributions += contribution;
            amount *= (1 + periodRate);
        }
        totalInterest = amount - principal - totalContributions;
        data.push({ period: i, amount: amount, principal: principal, contributions: totalContributions, interest: totalInterest });
    }

    futureValue = amount;
    totalInterest = futureValue - principal - totalContributions;

    document.getElementById('result').innerHTML = `
        Future Value: ${formatCurrency(futureValue)}<br>
        Principal: ${formatCurrency(principal)}<br>
        Total Contributions: ${formatCurrency(totalContributions)}<br>
        Interest Earned: ${formatCurrency(totalInterest)}
    `;

    drawChart(data, 'interestChart');
    populateTable(data, 'outputTable');

    // Show the export button and output table
    document.getElementById('exportButton').style.display = 'block';
    document.getElementById('outputTable').style.display = 'table';
}

// Mortgage Calculator
function calculateMortgage() {
    const homeValue = parseFloat(document.getElementById('homeValue').value.replace(/,/g, ''));
    const downPayment = parseFloat(document.getElementById('downPayment').value.replace(/,/g, '')) / 100;
    const loanTerm = parseInt(document.getElementById('loanTerm').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value.replace(/,/g, '')) / 100;
    const startMonth = parseInt(document.getElementById('startMonth').value);
    const startYear = parseInt(document.getElementById('startYear').value);
    const doublePayments = document.getElementById('doublePayments').value;
    const balloonPayment = parseFloat(document.getElementById('balloonPayment').value.replace(/,/g, '')) || 0;
    const balloonPeriod = parseInt(document.getElementById('balloonPeriod').value) || 0;

    if (isNaN(homeValue) || isNaN(downPayment) || isNaN(loanTerm) || isNaN(interestRate) || isNaN(startMonth) || isNaN(startYear)) {
        document.getElementById('mortgageResult').innerText = "Please enter valid numbers.";
        return;
    }

    const loanAmount = homeValue * (1 - downPayment);
    const monthlyRate = interestRate / 12;
    const numberOfPayments = loanTerm * 12;

    let monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));

    if (doublePayments === "yes") {
        monthlyPayment *= 2;
    }

    const data = [];
    let remainingBalance = loanAmount;
    let totalInterestPaid = 0;
    let cumulativePrincipal = 0;
    let cumulativeInterest = 0;
    let cumulativePaid = 0;

    for (let i = 1; i <= numberOfPayments; i++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;
        totalInterestPaid += interestPayment;
        cumulativePrincipal += principalPayment;
        cumulativeInterest += interestPayment;
        cumulativePaid += monthlyPayment;

        let totalPayment = monthlyPayment;
        if (i === balloonPeriod) {
            remainingBalance -= balloonPayment;
            cumulativePaid += balloonPayment;
            totalPayment += balloonPayment;
        }

        data.push({
            period: i,
            payment: monthlyPayment,
            principal: principalPayment,
            interest: interestPayment,
            totalPayment: totalPayment,
            remainingBalance: remainingBalance,
            cumulativePrincipal: cumulativePrincipal,
            cumulativeInterest: cumulativeInterest,
            cumulativePaid: cumulativePaid
        });

        if (remainingBalance <= 0) break;
    }

    document.getElementById('mortgageResult').innerHTML = `
        Monthly Payment: ${formatCurrency(monthlyPayment)}<br>
        Total Interest Paid: ${formatCurrency(totalInterestPaid)}<br>
        Total Paid: ${formatCurrency(totalInterestPaid + loanAmount)}
    `;

    drawMortgageChart(data);
    populateMortgageTable(data);

    // Show the export button and output table
    document.getElementById('exportMortgageButton').style.display = 'block';
    document.getElementById('mortgageTable').style.display = 'table';
}

// Retirement Savings Calculator
function calculateRetirementSavings() {
    const startingAmount = parseFloat(document.getElementById('startingAmount').value.replace(/,/g, ''));
    const rateOfReturn = parseFloat(document.getElementById('rateOfReturn').value.replace(/,/g, '')) / 100;
    const inflationRate = parseFloat(document.getElementById('inflationRate').value.replace(/,/g, '')) / 100;
    const withdrawalAmount = parseFloat(document.getElementById('withdrawalAmount').value.replace(/,/g, '')) || 0;
    const withdrawalPercentage = parseFloat(document.getElementById('withdrawalPercentage').value.replace(/,/g, '')) / 100 || 0;
    const retirementPeriod = parseInt(document.getElementById('retirementPeriod').value);

    if (isNaN(startingAmount) || isNaN(rateOfReturn) || isNaN(inflationRate) || isNaN(retirementPeriod)) {
        document.getElementById('retirementResult').innerText = "Please enter valid numbers.";
        return;
    }

    const data = [];
    let currentBalance = startingAmount;
    let totalWithdrawn = 0;

    for (let year = 1; year <= retirementPeriod; year++) {
        let withdrawal = withdrawalAmount;
        if (withdrawalPercentage > 0) {
            withdrawal = currentBalance * withdrawalPercentage;
        }
        totalWithdrawn += withdrawal;
        const interestEarned = currentBalance * rateOfReturn;
        currentBalance = currentBalance + interestEarned - withdrawal;
        data.push({
            year: year,
            startingBalance: currentBalance,
            withdrawal: withdrawal,
            interest: interestEarned,
            endingBalance: currentBalance
        });
    }

    document.getElementById('retirementResult').innerHTML = `
        Total Amount Withdrawn: ${formatCurrency(totalWithdrawn)}<br>
        Ending Balance: ${formatCurrency(currentBalance)}
    `;

    drawRetirementChart(data);
    populateRetirementTable(data);

    document.getElementById('exportRetirementButton').style.display = 'block';
    document.getElementById('retirementTable').style.display = 'table';
}

function drawRetirementChart(data) {
    const ctx = document.getElementById('retirementChart').getContext('2d');
    const labels = data.map(d => d.year);
    const startingBalances = data.map(d => d.startingBalance);
    const withdrawals = data.map(d => d.withdrawal);
    const interest = data.map(d => d.interest);
    const endingBalances = data.map(d => d.endingBalance);

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Starting Balance',
                    data: startingBalances,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Withdrawals',
                    data: withdrawals,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Interest Earned',
                    data: interest,
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Ending Balance',
                    data: endingBalances,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Years'
                    }
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Amount ($)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

function populateRetirementTable(data) {
    const tbody = document.getElementById('retirementTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear previous table data
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.year}</td>
            <td>${formatCurrency(row.startingBalance)}</td>
            <td>${formatCurrency(row.withdrawal)}</td>
            <td>${formatCurrency(row.interest)}</td>
            <td>${formatCurrency(row.endingBalance)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function drawChart(data, chartId) {
    const ctx = document.getElementById(chartId).getContext('2d');
    const labels = data.map(d => d.period);
    const principals = data.map(d => d.principal);
    const contributions = data.map(d => d.contributions);
    const interest = data.map(d => d.interest);

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Principal',
                    data: principals,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Total Contributions',
                    data: contributions,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Total Interest',
                    data: interest,
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Periods'
                    }
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Amount ($)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

function drawMortgageChart(data) {
    const ctx = document.getElementById('mortgageChart').getContext('2d');
    const labels = data.map(d => d.period);
    const cumulativePaid = data.map(d => d.cumulativePaid);
    const cumulativePrincipal = data.map(d => d.cumulativePrincipal);
    const cumulativeInterest = data.map(d => d.cumulativeInterest);
    const remainingBalance = data.map(d => d.remainingBalance);

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Cumulative Amount Paid',
                    data: cumulativePaid,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: 'Cumulative Principal',
                    data: cumulativePrincipal,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: 'Cumulative Interest',
                    data: cumulativeInterest,
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: 'Remaining Balance',
                    data: remainingBalance,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Periods'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Amount ($)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

function populateTable(data, tableId) {
    const tbody = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear previous table data
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.period}</td>
            <td>${formatCurrency(row.principal)}</td>
            <td>${formatCurrency(row.contributions)}</td>
            <td>${formatCurrency(row.interest)}</td>
            <td>${formatCurrency(row.amount)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function populateMortgageTable(data) {
    const tbody = document.getElementById('mortgageTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear previous table data
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.period}</td>
            <td>${formatCurrency(row.payment)}</td>
            <td>${formatCurrency(row.principal)}</td>
            <td>${formatCurrency(row.interest)}</td>
            <td>${formatCurrency(row.totalPayment)}</td>
            <td>${formatCurrency(row.remainingBalance)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function formatNumber(value) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function formatInput(event) {
    const value = event.target.value.replace(/,/g, '');
    if (!isNaN(value) && value !== '') {
        event.target.value = formatNumber(parseFloat(value));
    }
}

function exportTableToExcel() {
    const activeTableId = document.querySelector('.container table:not([style*="display: none"])').id;
    const table = document.getElementById(activeTableId);
    const workbook = XLSX.utils.table_to_book(table);
    XLSX.writeFile(workbook, 'data_export.xlsx');
}

document.addEventListener('DOMContentLoaded', () => {
    const calculateButton = document.getElementById('calculateButton');
    const calculateMortgageButton = document.getElementById('calculateMortgageButton');
    const calculateRetirementButton = document.getElementById('calculateRetirementButton');
    const exportButton = document.getElementById('exportButton');
    const exportMortgageButton = document.getElementById('exportMortgageButton');
    const exportRetirementButton = document.getElementById('exportRetirementButton');

    if (calculateButton) {
        calculateButton.addEventListener('click', calculateCompoundInterest);
        exportButton.addEventListener('click', exportTableToExcel);
    }

    if (calculateMortgageButton) {
        calculateMortgageButton.addEventListener('click', calculateMortgage);
        exportMortgageButton.addEventListener('click', exportTableToExcel);
    }

    if (calculateRetirementButton) {
        calculateRetirementButton.addEventListener('click', calculateRetirementSavings);
        exportRetirementButton.addEventListener('click', exportTableToExcel);
    }

    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('blur', formatInput);
    });
});
