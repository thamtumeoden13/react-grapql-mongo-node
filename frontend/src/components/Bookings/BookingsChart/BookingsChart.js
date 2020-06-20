import React from 'react'
import { Bar } from 'react-chartjs-2';

import './bookingsChart.css'

const BOOKINGS_BUCKETS = {
    Cheap: {
        min: 0,
        max: 100
    },
    Normal: {
        min: 100,
        max: 200
    },
    Expensive: {
        min: 200,
        max: 100000000000
    }
}

const BookingsChart = props => {

    const chartData = { labels: [], datasets: [] };
    let values = []
    let labels = []
    for (const bucket in BOOKINGS_BUCKETS) {
        const filterBookingsCount = props.bookings.reduce((prev, current) => {
            if (current.event.price >= BOOKINGS_BUCKETS[bucket].min && current.event.price < BOOKINGS_BUCKETS[bucket].max) {
                return prev + 1
            }
            else {
                return prev
            }
        }, 0)

        chartData.labels.push(bucket)
        values.push(filterBookingsCount)
    }
    chartData.datasets.push({
        label: 'BOOKINGS_BUCKETS',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        // barPercentage: 1,
        // barThickness: 6,
        // maxBarThickness: 8,
        // minBarLength: 0,
        data: values
    })
    console.log(chartData)

    return (
        <div >
            <Bar
                data={chartData}
                // width={100}
                // height={50}
                options={{
                    maintainAspectRatio: false
                }}
            />
        </div>
    )
}

export default BookingsChart;