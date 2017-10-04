module.exports = function (req, res, next) {
    if (!req.session || !req.session.user || !req.session.secondFactor) {
        res.redirect("/");
    } else {
        next();
    }
};
