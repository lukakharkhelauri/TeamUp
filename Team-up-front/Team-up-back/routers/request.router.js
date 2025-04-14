const express = require('express');
const requestController = require('../controllers/requests.controller');

const router = express.Router();

router.route('/')
  .get(requestController.getRequests)
  .post(requestController.sendRequest);

router.route('/check')
  .get(requestController.checkExistingRequest);

router.route('/:id/accept')
  .patch(requestController.acceptRequest)

router.route('/:id/deny')
    .patch(requestController.denyRequest);


module.exports = router;
