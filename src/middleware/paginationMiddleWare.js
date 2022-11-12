

function Newest(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            };
        }


        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }

        try {

            results.results = await model.find().sort({ createdAt: -1 }).limit(limit).skip(startIndex).exec();
            res.Newest = results;
            next();
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    };
}

function LowToHigh(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            };
        }


        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }

        try {
            results.results = await model.find().sort({ price: 1 }).limit(limit).skip(startIndex).exec();
            res.LowToHigh = results;
            next();
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    };
}

function HighToLow(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            };
        }


        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }

        try {
            results.results = await model.find().sort({ price: -1 }).limit(limit).skip(startIndex).exec();
            res.HighToLow = results;
            next();
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    };
}

function Rating(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            };
        }


        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }

        try {
            results.results = await model.find().sort({ rating: -1 }).limit(limit).skip(startIndex).exec();
            res.Rating = results;
            next();
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    };
}



module.exports = { Newest, LowToHigh, HighToLow, Rating };



