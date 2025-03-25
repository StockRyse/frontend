    function loadPriceChart(historicalPrices) {
        // Check if historicalPrices is undefined or not an array
        if (!historicalPrices || !Array.isArray(historicalPrices) || historicalPrices.length === 0) {
            const chartContainer = document.getElementById('priceChart');
            chartContainer.innerHTML = '<p class="text-white/70">No price data available</p>';
            return;
        }

        const chartContainer = document.getElementById('priceChart');
        chartContainer.innerHTML = ''; // Clear any existing content
        chartContainer.classList.add('relative', 'w-full', 'h-full'); // Ensure full container usage

        // Create a canvas element for the chart
        const canvas = document.createElement('canvas');
        canvas.id = 'stockPriceChart';
        canvas.classList.add('absolute', 'top-0', 'left-0', 'w-full', 'h-full'); // Position absolutely within container
        chartContainer.appendChild(canvas);

        // Validate and sanitize price data
        const validPrices = historicalPrices.filter(item =>
            item &&
            typeof item.date === 'string' &&
            typeof item.price === 'number' &&
            !isNaN(item.price)
        );

        // Sort prices by date (assuming they might not be in order)
        const sortedPrices = validPrices.sort((a, b) => new Date(a.date) - new Date(b.date));

        let chart; // Declare chart variable in outer scope

        function renderChart(filteredPrices) {
            // Destroy existing chart if it exists
            if (chart) {
                chart.destroy();
            }

            const labels = filteredPrices.map(item => item.date);
            const prices = filteredPrices.map(item => item.price);

            chart = new Chart(canvas, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Stock Price',
                        data: prices,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.3,
                        pointRadius: 3,
                        pointRadiusHover: 6,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // Important for custom sizing
                    layout: {
                        padding: {
                            top: 10,
                            bottom: 50, // Increased bottom padding to make room for buttons
                            left: 10,
                            right: 10
                        }
                    },
                    options: {
                        animation: {
                            duration: 800, // Smooth transitions
                            easing: 'easeInOutQuart' // More fluid animation
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            ticks: {
                                color: 'white', // Ensure y-axis labels are visible
                            },
                            grid: {
                                color: 'rgba(255,255,255,0.1)' // Light grid lines
                            }
                        },
                        x: {
                            ticks: {
                                color: 'white', // Ensure x-axis labels are visible
                                autoSkip: true,
                                maxTicksLimit: 10 // Limit number of x-axis labels
                            },
                            grid: {
                                color: 'rgba(255,255,255,0.1)' // Light grid lines
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: false // Remove title to save space
                        },
                        legend: {
                            display: false
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            titleColor: 'white',
                            bodyColor: 'white',
                            borderColor: 'rgba(255,255,255,0.2)',
                            borderWidth: 1,
                        }
                    }
                }
            });
        }

        // Create timeframe selection buttons
        const timeframeControls = document.createElement('div');
        timeframeControls.classList.add(
            'absolute', 'bottom-0', 'left-0', 'right-0', // Changed bottom-2 to bottom-0
            'flex', 'justify-center', 'space-x-2', 'z-10',
            'pb-2' // Add some padding at the bottom
        );

        const timeframes = [
            { label: '1M', days: 30 },
            { label: '3M', days: 90 },
            { label: '6M', days: 180 },
            { label: '1Y', days: 365 },
            { label: 'Max', days: Infinity }
        ];

        // Create buttons for different timeframes
        timeframes.forEach(timeframe => {
            const button = document.createElement('button');
            button.textContent = timeframe.label;
            button.classList.add(
                'px-3', 'py-1', 'rounded', 'text-white',
                'bg-white/10', 'hover:bg-white/20',
                'transition-colors', 'duration-200',
                'text-xs', 'focus:ring-2', 'focus:ring-white/50'
            );

            button.addEventListener('click', () => {
                document.querySelectorAll('.timeframe-button').forEach(btn => btn.classList.remove('bg-white/20'));
                button.classList.add('bg-white/20');
                const now = new Date();
                const filteredPrices = timeframe.days === Infinity
                    ? sortedPrices
                    : sortedPrices.filter(item => {
                        const itemDate = new Date(item.date);
                        const daysDiff = (now - itemDate) / (1000 * 60 * 60 * 24);
                        return daysDiff <= timeframe.days;
                    });

                renderChart(filteredPrices);
            });

            timeframeControls.appendChild(button);
        });

        // Add timeframe controls to the chart container
        chartContainer.appendChild(timeframeControls);

        // Initially render the 1-year view
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const filteredPrices = sortedPrices.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= oneYearAgo;
        });

        // Only render if we have filtered prices
        if (filteredPrices.length > 0) {
            renderChart(filteredPrices);
        } else {
            chartContainer.innerHTML = '<p class="text-white/70">Insufficient price data for chart</p>';
        }
    }