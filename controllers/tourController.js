// const fs = require('fs');
const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
    // console.log(req.files);

    if (!req.files.imageCover || !req.files.images) return next();

    // Cover Images
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer).resize(2000, 1333).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/tours/${req.body.imageCover}`);

    // Images
    req.body.images = [];

    await Promise.all(
        req.files.images.map(async (file, i) => {
            const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

            await sharp(file.buffer).resize(2000, 1333).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/tours/${filename}`);

            req.body.images.push(filename);
        })
    );

    next();
});

// upload.single('images', 5); req.file
// upload.array('images', 5); req.files

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

/*
exports.checkID = (req, res, next, val) => {
    console.log(`Tour id id ${val}`);

    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: `Invalid ID`
        });
    }
    next();
}
exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: `Missing name or price`
        });
    }
    next();
}

exports.getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success', results: tours.length, requestTimeAt: req.requestTime, data: {
            tours
        }
    });
};

exports.getTour = (req, res) => {
    // console.log(req.params);
    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id === id);

    // if (id > tours.length) {
    if (!tour) {
        return res.status(404).json({ status: 'fail', message: `Invalid ID` });
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
};

exports.createTour = (req, res) => {
    // console.log(req.body);
    // res.send("Done");

    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success', data: {
                tour: newTour
            }
        })
    })
};

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: `<Updated tour here....>`
        }
    });
};

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null
    });
};
*/

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

    next();
};

// exports.getAllTours = async (req, res) => {
//     try {
//         /*    
//             // console.log(req.query);

//             // Filtering
//             const queryObj = { ...req.query };
//             const excludesFields = ['page', 'sort', 'limit', 'fields'];
//             excludesFields.forEach(el => delete queryObj[el]);

//             // console.log(req.query, queryObj);
//             // const tours = await Tour.find(queryObj);

//             // Advanced Filtering
//             let queryStr = JSON.stringify(queryObj);
//             queryStr = queryStr.replace(/\bgte|gt|lte|lt\b/g, match => `$${match}`);

//             // console.log(JSON.parse(queryStr));
//             let query = Tour.find(JSON.parse(queryStr));


//             // Sorting
//             if (req.query.sort) {
//                 const sortBy = req.query.sort.split(',').join(' ');
//                 // console.log(sortBy);
//                 query = query.sort(sortBy);
//             } else {
//                 query = query.sort('-createdAt');
//             }




//             // Field limiting
//             if (req.query.fields) {
//                 const fields = req.query.fields.split(',').join(' ');
//                 query = query.select(fields);
//             } else {
//                 query = query.select('-__v');
//             }

//             // Pagination
//             const page = req.query.page * 1 || 1;
//             const limit = req.query.limit * 1 || 100;
//             const skip = (page - 1) * limit;

//             query = query.skip(skip).limit(limit);

//             if (req.query.page) {
//                 const numTours = await Tour.countDocuments();
//                 if (skip > numTours) {
//                     throw new Error('This page soes not exist');
//                 };
//             }
//         */

//         // EXECUTE QUERY
//         // const tours = await query;

//         const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
//         const tours = await features.query;


//         // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

//         res.status(200).json({
//             status: 'success',
//             results: tours.length,
//             data: {
//                 tours
//             }
//         });
//     } catch (err) {
//         res.status(400).json({
//             status: 'fail',
//             message: err
//         });
//     }
// };

// exports.getTour = async (req, res) => {
//     try {
//         const tour = await Tour.findById(req.params.id);
//         // Tour.findOne({ id: req.params.id })
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 tour
//             }
//         });
//     } catch (err) {
//         res.status(400).json({
//             status: 'fail',
//             message: err
//         });
//     }
// };

// exports.createTour = async (req, res) => {
//     try {
//         const newTour = await Tour.create(req.body);
//         res.status(201).json({
//             status: 'success',
//             data: {
//                 tour: newTour
//             }
//         });
//     } catch (err) {
//         res.status(400).json({
//             status: 'fail',
//             message: err
//             // message: "Invalid Data Sent!"
//         });
//     }
// };

// exports.updateTour = async (req, res) => {
//     try {
//         const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//             runValidators: true
//         });
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 tour
//             }
//         });
//     } catch (err) {
//         res.status(400).json({
//             status: 'fail',
//             message: err
//         });
//     }
// };

// exports.deleteTour = async (req, res) => {
//     try {
//         const tour = await Tour.findByIdAndDelete(req.params.id);
//         res.status(204).json({
//             status: 'success',
//             data: null
//         });
//     } catch (err) {
//         res.status(400).json({
//             status: 'fail',
//             message: err
//         });
//     }
// };

// exports.getTourStats = async (req, res) => {
//     try {
//         const stats = await Tour.aggregate([
//             {
//                 $match: { ratingsAverage: { $gte: 4.5 } },
//             },
//             {
//                 $group: {
//                     _id: { $toUpper: '$difficulty' },
//                     numTours: { $sum: 1 },
//                     numRatings: { $sum: '$ratingsQuantity' },
//                     avgRating: { $avg: '$ratingsAverage' },
//                     avgPrice: { $avg: '$price' },
//                     minPrice: { $min: '$price' },
//                     maxPrice: { $max: '$price' }
//                 }
//             },
//             {
//                 $sort: { avgPrice: 1 }
//             },
//             // {
//             //     $match: { _id: { $ne: 'EASY' } }
//             // }
//         ]);
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 stats
//             }
//         });
//     }
//     catch (err) {
//         res.status(404).json({
//             status: 'fail',
//             message: err
//         });
//     }
// }

// exports.getMonthlyPlan = async (req, res) => {
//     try {
//         const year = req.params.year * 1;

//         const plan = await Tour.aggregate([
//             {
//                 $unwind: '$startDates'
//             },
//             {
//                 $match: {
//                     startDates: {
//                         $gte: new Date(`${year}-01-01`),
//                         $lte: new Date(`${year}-12-31`)
//                     }
//                 }
//             },
//             {
//                 $group: {
//                     _id: { $month: '$startDates' },
//                     numTourStarts: { $sum: 1 },
//                     tours: { $push: '$name' }
//                 }
//             },
//             {
//                 $addFields: { month: '$_id' }
//             },
//             {
//                 $project: {
//                     '_id': 0
//                 }
//             },
//             {
//                 $sort: {
//                     numTourStarts: -1
//                 }
//             },
//             {
//                 $limit: 12 // Number of months in a year
//             }

//         ]);

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 plan
//             }
//         });
//     } catch (err) {
//         res.status(404).json({
//             status: 'fail',
//             message: err
//         });
//     }
// }


// exports.getAllTours = catchAsync(async (req, res, next) => {
//     const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
//     const tours = await features.query;

//     res.status(200).json({
//         status: 'success',
//         results: tours.length,
//         data: {
//             tours
//         }
//     });
// });

// exports.getTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findById(req.params.id).populate('reviews');

//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404));
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     });
// });

// exports.createTour = catchAsync(async (req, res, next) => {
//     const newTour = await Tour.create(req.body);

//     res.status(201).json({
//         status: 'success',
//         data: {
//             tour: newTour
//         }
//     });
// });

// exports.updateTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true
//     });

//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404));
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     });
// });

// exports.deleteTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndDelete(req.params.id);

//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404));
//     }

//     res.status(204).json({
//         status: 'success',
//         data: null
//     });
// });

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: { avgPrice: 1 }
        },
        // {
        //     $match: { _id: { $ne: 'EASY' } }
        // }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {

    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: {
                '_id': 0
            }
        },
        {
            $sort: {
                numTourStarts: -1
            }
        },
        {
            $limit: 12 // Number of months in a year
        }

    ]);

    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    });
});

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/-40,45/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1

    if (!lat || !lng) {
        next(new AppError('Please provide latitude and longitude in the formot lat,lng.', 400));
    }

    // console.log(distance, lat, lng, unit);
    const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } });

    console.log(tours);

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours
        }
    });

});

exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    if (!lat || !lng) {
        next(new AppError('Please provide latitude and longitude in the formot lat,lng.', 400));
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'point',
                    coordinates: [lng * 1, lat * 1],
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ])


    res.status(200).json({
        status: 'success',
        data: {
            data: distances
        }
    });
});

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
