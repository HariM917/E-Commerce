const dns = require('dns');
dns.resolveSrv('_mongodb._tcp.cluster0.set9j2m.mongodb.net', (err, addresses) => {
    if (err) {
        console.error('SRV Resolution Error:', err);
        return;
    }
    console.log('SRV Addresses:', addresses);
});
