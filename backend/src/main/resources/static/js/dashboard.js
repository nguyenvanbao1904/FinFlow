document.addEventListener('DOMContentLoaded', () => {
    const userGrowthChartEl = document.getElementById('user-growth-chart');

    if (userGrowthChartEl) {
        new Chart(userGrowthChartEl, {
            type: 'line', // Chart.js dùng 'line' + fill để tạo area chart
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
                    "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [{
                    label: 'Người dùng mới',
                    data: [31, 40, 28, 51, 42, 109, 100, 120, 110, 130, 125, 150],
                    fill: true,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)', // màu nền (area)
                    borderColor: 'rgba(59, 130, 246, 1)', // màu đường
                    tension: 0.4 // làm đường cong mượt giống curve: 'smooth'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return context[0].label; // hiện tháng
                            },
                            label: function(context) {
                                return context.dataset.label + ': ' + context.formattedValue;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Tháng' }
                    },
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Số người dùng' }
                    }
                }
            }
        });
    }
})

