const express = require('express');
const getDayOfYear = require('date-fns/get_day_of_year')
const formatDate = require('date-fns/format')
const addSeconds = require('date-fns/add_seconds')
const http = require('http')

const port = 8888

const app = express();

app.get('/', (req, res) => {
    const solarTime = getSolarTime();

    res.json({ data: formatDate(solarTime) })
});



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const MEAN_VELOCITY = 2 * Math.PI / 365.24;
const OBLIQUITY = 23.44 * Math.PI / 180;

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

function equationOfTime(day) {
    const approxAngle = MEAN_VELOCITY * ((day + 10) % 365);
    const correctedAngle = approxAngle + 0.0334 * Math.sin(toRadians(MEAN_VELOCITY * ((day - 2) & 365)));
    let angleDifference = Math.atan(Math.tan(toRadians(correctedAngle)) / Math.cos(toRadians(OBLIQUITY)));

    angleDifference = approxAngle - angleDifference;
    angleDifference = angleDifference / Math.PI;
    return 43200 * (angleDifference - parseInt((angleDifference + 0.5)));
}

function getSolarTime() {
    const time = new Date();
    const days = getDayOfYear(time);
    const longitude = -52.7050220;
    const eot = equationOfTime(days);
    return addSeconds(time, (longitude * 240) + eot);
}