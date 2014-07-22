module.exports = {
    port: 443,
    fakeServers:[
        /**
         * input all servers you want to fake here
         * the required fields are hostname (e.g. 'oauthdev.isaacloud.com' - no protocol/port/path)
         * and appDir (file where the fake server is stored, e.g. './fake-oauth/app.js')
         */
        {
            hostname: 'apidev.isaacloud.com',
            fakeIP: '127.0.0.1',
            appDir: '../fake-api/app.js',
            config: {
                raml: ''
            }
        },
        {
            hostname: 'oauthdev.isaacloud.com',
            fakeIP: '127.0.0.1',
            appDir: '../fake-oauth/app.js',
            config: {
                arbiterUrl: 'https://connectdev.isaacloud.com/arbiter/'
            }
        },
        {
            hostname: 'connectdev.isaacloud.com',
            fakeIP: '127.0.0.1',
            appDir: '../fake-connect/app.js'
        }
    ],
    hostsUtil: {
        //FIXME: DON'T USE IT YET, NOT STABLE - CAN ACCIDENTALLY ERASE YOUR HOSTS FILE
        //DETAILS IN hostsUtil.js
        use: false,
        path: 'C:/Windows/System32/drivers/etc/hosts',
        newline:'\r\n'
    }
};