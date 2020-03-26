module.exports = {
    key: require("./key").key,
    queries: [
        "a",
        "b"
    ],
    outputsize: "full", //full, compact
    data_api: "TIME_SERIES_DAILY"
    //TIME_SERIES_INTRADAY, TIME_SERIES_DAILY, TIME_SERIES_DAILY_ADJUSTED, TIME_SERIES_WEEKLY, TIME_SERIES_WEEKLY_ADJUSTED, TIME_SERIES_MONTHLY, TIME_SERIES_MONTHLY_ADJUSTED
};