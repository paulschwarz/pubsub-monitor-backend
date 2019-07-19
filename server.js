const Koa = require('koa');
const router = require('koa-router')();
const cors = require('@koa/cors');
const sns = require('./repository/sns/sns');
const json = require('koa-json');
const app = new Koa();

app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

router.get(
    '/',
    ctx => {
        return sns
            .fetchSubscriptions()
            .then(function (subscriptions) {
                ctx.body = subscriptions.map(subscription => {
                    return {
                        topic: subscription.TopicArn,
                        endpoint: subscription.Endpoint,
                    }
                });
            })
    }
);

app
    .use(cors())
    .use(json())
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(process.env.PORT || 9000);
