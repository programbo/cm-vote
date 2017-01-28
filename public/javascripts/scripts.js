const getCampaignId = () => {
  const parsedSearch = location.search.match(/cid=([0-9a-f]{32})/i);
  if (parsedSearch.length === 2) {
    return parsedSearch[1];
  }
};

const updateCampaginInfo = (campaign) => {
  console.log('updateCampaginInfo', campaign); // eslint-disable-line no-console
};

const parseChartData = (results) => {
  const labels = Object.keys(results);
  const data = labels.map((label) => results[label]);
  return {
    labels,
    datasets: [{
      data,
      backgroundColor: labels.map((label, index) => `hsl(300, 85%, ${100-(15*index)}%)`),
      borderWidth: labels.map(() => 4),
      borderColor: labels.map(() => 'hsl(300, 85%, 25%)')
    }]
  }
};

const redirectWithCampaignId = (cid, location) => {
  const { protocol, host, pathname } = location;
  location.href = `${protocol}//${host}${pathname}?cid=${cid}`;
};

const activateCampaignsMenu = (campaigns) => {
  const campaignsMenu = document.getElementById('campaigns');
  if (campaignsMenu) {
    campaigns.forEach(({ CampaignID, Name, SentDate }) => {
      $(`<option value="${CampaignID}">${Name} (Sent ${SentDate})</option>`).appendTo(campaignsMenu);
    });
    campaignsMenu.style.display = 'block';
    campaignsMenu.addEventListener('change', () => {
      const campaignId = campaignsMenu.querySelector(':checked').value;
      redirectWithCampaignId(campaignId, location);
    });
  }
};

const fetchCampaignData = (cid = '', success, error) => {
  $.ajax({
    type: 'GET',
    url: '/api',
    data: { cid },
    success,
    error: error || ((xhr, type) => {
      console.log('xhr', xhr); // eslint-disable-line no-console
      console.log('type', type); // eslint-disable-line no-console
    })
  });
}

const drawResults = (type, results, { Name }) => {
  const data = parseChartData(results);
  const myPieChart = new Chart('chart', {
    type,
    data,
    options: {
      title: {
        display: true,
        text: Name,
        fontFamily: 'Averta W01 Black',
        fontSize: 36,
        padding: 30,
        fontColor: '#fff'
      },
      legend: {
        position: 'bottom',
        labels: {
          fontSize: 16,
          fontFamily: 'Averta W01 Black',
          padding: 30,
          fontColor: '#fff'
        }
      },
      tooltips: {
        titleFontSize: 18,
        bodyFontSize: 18,
        xPadding: 10,
        yPadding: 10,
        caretSize: 9
      },
      animation: {
        duration: 300
      }
    }
  });
};

$(() => {
  const campaignId = getCampaignId();
  fetchCampaignData(campaignId, ({ campaign, campaigns, results }) => {
    if (campaigns) {
      activateCampaignsMenu(campaigns);
    }
    else if (results && campaign) {
      drawResults('pie', results, campaign);
    }
  });
});
