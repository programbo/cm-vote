var express = require('express');
var router = express.Router();

// import { getCampaigns, getClicks } from '../helpers/campaignmonitor';
// import { removeMultipleVotes, tallyVotes } from '../helpers';

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { cid: req.query.cid });
  // const { cid, html } = req.query;
  // console.log('html', html); // eslint-disable-line no-console
  // getCampaigns()
  //   .then(({ data: campaigns }) => {
  //     const campaign = campaigns.find(({ CampaignID }) => CampaignID === cid);
  //     campaigns = campaigns.map((c) => ({ ...c, SentDate: (new Date(c.SentDate)).toDateString() }))
  //     let responseData = {
  //       cid,
  //       campaign,
  //       campaigns
  //     };
  //     if (campaign) {
  //       getClicks(cid)
  //         .then((clicks) => Promise.resolve(tallyVotes(removeMultipleVotes(clicks))))
  //         .then((urls) => {
  //           const data = { ...responseData, urls };
  //           html ? res.render('index', data) : res.json(data);
  //         })
  //         .catch((err) => {
  //           console.log('getClicks error', err); // eslint-disable-line no-console
  //         })
  //     }
  //     else {
  //       html ? res.render('index', responseData) : res.json(responseData);
  //     }
  //   })
  //   .catch((err) => {
  //     console.log('getCampaigns error', err); // eslint-disable-line no-console
  //   })
});

module.exports = router;
