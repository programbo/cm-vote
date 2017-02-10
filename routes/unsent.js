var express = require('express');
var router = express.Router();

import { getUnsentCampaigns } from '../helpers/campaignmonitor';

/* GET unsent campaigns page. */
router.get('/', (req, res, next) => {
  getUnsentCampaigns()
    .then(({ data: campaigns }) => {
      res.render('unsent', { campaigns });
    })
});

module.exports = router;
