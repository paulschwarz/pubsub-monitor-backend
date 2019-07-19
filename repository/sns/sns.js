var SNS = require('aws-sdk/clients/sns');

const sns = new SNS({
    region: "eu-west-1",
});

const fetchSubscriptionsIterable = (resolve, subscriptions, nextToken) => {
    sns.listSubscriptions({ NextToken: nextToken }, (err, data) => {
        if (err) console.log(err, err.stack);
        else {
            data.Subscriptions.forEach(subscription => subscriptions.push(subscription));

            if (data.NextToken) {
                console.debug(`Iterating with NextToken ${data.NextToken}`);
                fetchSubscriptionsIterable(resolve, subscriptions, data.NextToken);
            } else {
                console.debug(`Found ${subscriptions.length} subscriptions`);
                resolve(subscriptions);
            }
        }
    });
}

const fetchSubscriptions = () => {
    return new Promise(resolve => {
        const subscriptions = [];
        console.debug("Fetching subscriptions");
        fetchSubscriptionsIterable(resolve, subscriptions);
    })
}

module.exports = {
    fetchSubscriptions
}
