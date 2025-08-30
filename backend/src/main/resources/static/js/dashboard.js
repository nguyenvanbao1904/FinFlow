document.addEventListener('DOMContentLoaded', () => {
    const userGrowthChartEl = document.getElementById('user-growth-chart');

    if (userGrowthChartEl && typeof statistics !== 'undefined') {
        // Khởi tạo mảng labels và data với giá trị mặc định 12 tháng = 0
        const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const dataValues = Array(12).fill(0);

        // statistics là List<UserMonthlyStat> => [{month: 1, total: 10}, ...]
        statistics.forEach(item => {
            const monthIndex = item.month - 1; // tháng 1 -> index 0
            dataValues[monthIndex] = item.total;
        });

        new Chart(userGrowthChartEl, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Người dùng mới',
                    data: dataValues,
                    fill: true,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
                            },
                            label: function(context) {
                                return context.dataset.label + ': ' + context.formattedValue;
                            }
                        }
                    }
                },
                scales: {
                    x: { title: { display: true, text: 'Tháng' } },
                    y: { beginAtZero: true, title: { display: true, text: 'Số người dùng' } }
                }
            }
        });
    }
});
