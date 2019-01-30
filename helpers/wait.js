module.exports = function wait(ms) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};
