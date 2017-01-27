const parseChartData = ({ results }) => {
  const labels = Object.keys(results);
  const data = labels.map((label) => results[label]);
  return {
    labels,
    datasets: [{
      data
    }]
  }
};

const redirectWithCampaignId = (cid, location) => {
  const { protocol, host, pathname } = location;
  location.href = `${protocol}//${host}${pathname}?cid=${cid}`;
};

const activateCampaignsMenu = () => {
  const campaignsMenu = document.getElementById('campaigns');
  if (campaignsMenu) {
    campaignsMenu.addEventListener('change', () => {
      const campaignId = campaignsMenu.querySelector(':checked').value;
      redirectWithCampaignId(campaignId, location);
    });
  }
}

const fetchChartData = (cid, success) => {
  $.ajax({
    type: 'GET',
    url: 'http://john.local:3000/api',
    data: { cid },
    success,
    error: (xhr, type) => {
      console.log('xhr', xhr); // eslint-disable-line no-console
      console.log('type', type); // eslint-disable-line no-console
    }
  });
}

const drawResults = () => {
  const chart = document.getElementById('chart');
  if (chart) {
    const cid = chart.getAttribute('data-cid');
    if (cid) {
      fetchChartData(cid, (results) => {
        console.log('results', results); // eslint-disable-line no-console
      });
    }
  }
}

$(() => {
  activateCampaignsMenu();
  drawResults();
});
