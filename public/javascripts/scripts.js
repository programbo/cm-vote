const getCampaignId = () => {
  const parsedSearch = location.search.match(/cid=([0-9a-f]{32})/i);
  if (parsedSearch && parsedSearch.length === 2) {
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

const getCampaignsMenu = (menuId) => {
  let campaignsMenu = document.getElementById(menuId);
  if (!campaignsMenu) {
    campaignsMenu = document.createElement('select');
    campaignsMenu.id = menuId;
    document.body.appendChild(campaignsMenu);
    const option = document.createElement('option');
    option.textContent = 'Select a Sent Campaign';
    campaignsMenu.appendChild(option);
  }
  return campaignsMenu;
}

const activateCampaignsMenu = (campaigns) => {
  const campaignsMenu = getCampaignsMenu('campaigns');
  if (campaignsMenu) {
    campaigns.forEach(({ CampaignID, Name, SentDate }) => {
      const option = document.createElement('option');
      option.value = CampaignID;
      option.textContent = `${Name} (Sent ${SentDate})`;
      campaignsMenu.appendChild(option);
    });
    campaignsMenu.style.display = 'block';
    campaignsMenu.addEventListener('change', () => {
      const campaignId = campaignsMenu.querySelector(':checked').value;
      redirectWithCampaignId(campaignId, location);
    });
  }
};

const fetchCampaignData = (cid = '', success, error) => {
  fetch(`/api?cid=${cid}`)
    .then((response) => response.json())
    .then(success)
    .catch(error || ((xhr, type) => {
      console.log('xhr', xhr); // eslint-disable-line no-console
      console.log('type', type); // eslint-disable-line no-console
    }));
}

const getChartElement = (chartId) => {
  let chart = document.getElementById(chartId);
  if (!chart) {
    chart = document.createElement('canvas');
    chart.id = chartId;
    document.body.appendChild(chart);
  }
  return chart;
};

const drawResults = (type, results, { Name }) => {
  const data = parseChartData(results);
  const myPieChart = new Chart(getChartElement('chart'), {
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
          fontSize: 24,
          fontFamily: 'Averta W01 Semibold',
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

const ready = () => {
  const campaignId = getCampaignId();
  fetchCampaignData(campaignId, ({ campaign, campaigns, results }) => {
    if (campaigns) {
      activateCampaignsMenu(campaigns);
    }
    else if (results && campaign) {
      drawResults('pie', results, campaign);
    }
  });
};

{
  if (document.readyState != 'loading'){
    ready();
  } else {
    document.addEventListener('DOMContentLoaded', ready);
  }
}
