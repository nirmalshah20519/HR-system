export var vacancyStatus;
(function (vacancyStatus) {
    vacancyStatus[vacancyStatus["closed"] = 0] = "closed";
    vacancyStatus[vacancyStatus["open"] = 1] = "open";
})(vacancyStatus || (vacancyStatus = {}));
