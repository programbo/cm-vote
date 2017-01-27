import axios from 'axios';
import { apiKey, clientId } from '../credentials';

const method = 'get';
const auth = {
  username: apiKey,
  password: 'meerkats' // not used
};

const getQueryForUrl = (url) => ({ method, auth, url });

export const getCampaigns = () => axios(getQueryForUrl(`https://api.createsend.com/api/v3.1/clients/${clientId}/campaigns.json`));

const getClicksForPage = (campaignId, page = 1) => axios(getQueryForUrl(`https://api.createsend.com/api/v3.1/campaigns/${campaignId}/clicks.json?page=${page}`));

export const getClicks = (campaignId) => new Promise((resolve, reject) => {
  let page = 1;
  let allClicks = [];
  const getMoreClicks = () => {
    if (!campaignId) {
      reject('No campaign ID');
    }
    getClicksForPage(campaignId, page++)
      .then(({ data: { Results } }) => {
        allClicks = allClicks.concat(Results.filter(({ URL }) => URL.indexOf('http') === 0));
        Results.length === 1000 ? getMoreClicks() : resolve(allClicks);
      });
  };
  getMoreClicks();
});
