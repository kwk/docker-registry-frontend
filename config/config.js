module.exports = {
    db: {
        url: 'mongodb://localhost:27017/somedb'
    },
    http: {
        port: 8080,
        logging: {
            // See https://github.com/expressjs/morgan#predefined-formats
            format: 'dev'
        }
    }
}
