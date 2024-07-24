const router = require('express').Router();
router.use('/auth' , require('./authRoutes'))
router.use('/area' , require('./areaRoutes'))
router.use('/developer' , require('./developerRoutes'))
router.use('/compound' , require('./compoundRoutes'))
router.use('/type' , require('./typeRoutes'))
router.use('/property' , require('./propertyRoutes'))
router.use('/launch' , require('./launchRoutes'))
router.use('/requests' , require('./requestsRoutes'))
router.use('/offers' , require('./offerRoutes'))
module.exports = router;