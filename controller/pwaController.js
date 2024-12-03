const path = require('path')

const PwaController = {
    async getManifest(req, res) {
        try {

            res.set('Content-Type', 'application/json');
            res.sendFile(path.join(__dirname, 'manifest.json'));
        } catch (error) {
            console.log(error)
        }
    },
    async getServiceWorker(req, res) {
        try {
            res.set('Content-Type', 'application/javascript');
            res.set('Service-Worker-Allowed', '/');
            res.sendFile(path.join(__dirname, 'service-worker.js'));
        } catch (error) {
            console.log(error)
        }

    }
}

module.exports = PwaController;