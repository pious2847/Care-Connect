// utils/alert.js
const alert = {
    success: (req, message) => {
        req.flash('message', message);
        req.flash('status', 'success');
    },
    error: (req, message) => {
        req.flash('message', message);
        req.flash('status', 'danger');
    },
    info: (req, message) => {
        req.flash('message', message);
        req.flash('status', 'info');
    },
    warning: (req, message) => {
        req.flash('message', message);
        req.flash('status', 'warning');
    }
};

module.exports = alert;