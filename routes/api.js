var express = require('express');
var router = express.Router();

import { getCampaigns, getClicks } from '../helpers/campaignmonitor';
import { extractVotes, removeMultipleVotes, removeOldVotes, tallyVotes } from '../helpers';

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
          .then((clicks) => Promise.resolve(tallyVotes(removeOldVotes(removeMultipleVotes(extractVotes(clicks))))))
          .then((results) => {
            responseData.results = results;
            html ? res.render('index', responseData) : res.status(200).json(responseData);
          })
          .catch(({ response: { status, data }}) => {
            res.status(500).json({ data });
          })
      }
      else {
        responseData.campaigns = campaigns;
        html ? res.render('index', responseData) : res.status(200).json(responseData);
      }
    })
    .catch(({ response: { status, data }}) => {
      res.status(status).json({ data });
    })
});

module.exports = router;
