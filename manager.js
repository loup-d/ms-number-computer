const MM = require("ms-manager");
let config = require(`./config.json`) || {};

const Sentry = require("@sentry/node");
// or use es6 import statements
// import * as Sentry from '@sentry/node';

const Tracing = require("@sentry/tracing");
// or use es6 import statements
// import * as Tracing from '@sentry/tracing';

Sentry.init({
    dsn: "https://932dc28c8a2e48b8a07d611b574dd9d0@o1287347.ingest.sentry.io/6504598",

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

const transaction = Sentry.startTransaction({
    op: "test",
    name: "My First Test Transaction",
});

setTimeout(() => {
    try {
        foo();
    } catch (e) {
        Sentry.captureException(e);
    } finally {
        transaction.finish();
    }
}, 99);

MM.init(config, (err, serviceInfo) => {
    if (err) {
        return console.error(err);
    }

    /**
     * Our micro-service is now up.
     * */
    console.log("#Micro-service UP#");

    /**
     * You can now subscribe to specific message
     */
    MM.subscribe("add", (bdy, msg) => {
        /**
         * TODO: Uncomment when operationnal
         **/
        const computer = require("./computer");
        try {
            const result = computer.add(+bdy.a, +bdy.b);
            msg.reply({ result });
        } catch (err) {
            console.error(err);
            return msg.replyErr(err);
        }
    });
});
