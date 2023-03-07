module.exports = (req, res, next) => {
    if (req.headers.origin) {
        res.setHeader(
            "Access-Control-Allow-Origin", req.headers.origin
        )
    }
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    )
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin,Authorization,X-Requested-With,Content-type,Accept"
    )
    res.setHeader("Access-Control-Allow-Credentials", true);
    console.log(res)
    if ("OPTIONS" === req.method) {
        return res.sendStatus(200);
    }

    return next();
};
