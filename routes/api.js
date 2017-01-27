var express = require('express');
var router = express.Router();

import { getCampaigns, getClicks } from '../helpers/campaignmonitor';
import { removeMultipleVotes, removeOldVotes, tallyVotes } from '../helpers';

/* GET home page. */
router.get('/', (req, res, next) => {
  const { cid, html } = req.query;
  getCampaigns()
    .then(({ data: campaigns }) => {
      let responseData = { cid };
      const campaign = campaigns.find(({ CampaignID }) => CampaignID === cid);
      campaigns = campaigns.map((c) => ({ ...c, SentDate: (new Date(c.SentDate)).toDateString() }))
      if (campaign) {
        responseData.campaign = campaign;
        getClicks(cid)
          .then((clicks) => Promise.resolve(tallyVotes(removeOldVotes(removeMultipleVotes(clicks)))))
          .then((results) => {
            responseData.results = results;
            html ? res.render('index', responseData) : res.json(responseData);
          })
          .catch((err) => {
            console.log('getClicks error', err); // eslint-disable-line no-console
          })
      }
      else {
        responseData.campaigns = campaigns;
        html ? res.render('index', responseData) : res.json(responseData);
      }
    })
    .catch((err) => {
      console.log('getCampaigns error', err); // eslint-disable-line no-console
    })
});

module.exports = router;
