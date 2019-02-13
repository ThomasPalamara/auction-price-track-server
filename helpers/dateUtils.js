exports.get28DayOldDate = () => {
    let date = new Date(Date.now() - (28 * 24 * 60 * 60 * 1000));

    date = new Date(date.setHours(0, 0, 0, 0)); // Set time to midnight

    return date;
};
