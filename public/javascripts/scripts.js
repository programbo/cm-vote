let spinner;

const parseURL = () => {
  const parsedSearch = location.pathname.match(/vote\/([0-9a-f]{32})\/?(.*)$/i);
  if (parsedSearch && parsedSearch.length) {
    const [vote, campaignId, answer] = parsedSearch;
    return { vote, campaignId, answer };
  }
  else {
    return {};
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
      backgroundColor: ['#d44c3e', '#f8a331'],
      borderWidth: labels.map(() => 0)
    }]
  }
};

const redirectWithCampaignId = (cid, location) => {
  const { protocol, host, pathname } = location;
  location.href = `${protocol}//${host}/vote/${cid}`;
};

const getCampaignsMenu = (menuId) => {
  let campaignsMenu = document.getElementById(menuId);
  if (!campaignsMenu) {
    const campaignsMenuWrapper = document.createElement('div');
    campaignsMenuWrapper.id = 'campaigns-wrapper';
    campaignsMenu = document.createElement('select');
    campaignsMenu.id = menuId;
    getContainer('#content').appendChild(campaignsMenuWrapper);
    campaignsMenuWrapper.appendChild(campaignsMenu);
    const option = document.createElement('option');
    option.textContent = 'Select a Sent Campaign...';
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
    getContainer('#content').appendChild(chart);
  }
  return chart;
};

const drawLegend = (results) => {
  const answers = Object.keys(results);
  const totalVotes = answers.reduce((votes, label) => (votes += results[label]), 0);
  const legendContainer = document.createElement('div');
  const container = getContainer('#content-wrapper');
  legendContainer.classList.add('legend-container');
  container.insertBefore(legendContainer, container.firstChild);
  const calculatePercentage = (votes) => Math.round((votes / totalVotes) * 100);
  answers.forEach((label) => {
    const legend = document.createElement('div');
    legend.innerHTML = `<span class="label">${label}</span><span class="result">${calculatePercentage(results[label])}%</span>`;
    legend.classList.add('legend');
    legendContainer.appendChild(legend);
  });
};

const drawResults = (type, results, { Name }, answer) => {
  const data = parseChartData(results);
  const myPieChart = new Chart(getChartElement('chart'), {
    type,
    data,
    options: {
      title: {
        display: false,
      },
      legend: {
        display: false,
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
  drawLegend(results);

  const thankyou = answer ? '<span>Thank you for your vote.</span><br>' : '';
  printMessage(`${thankyou}<span>Check out the results so far...</span>`, true);
};

const getContainer = (selector = 'body') => document.querySelector(selector) || document.body;

const printMessage = (message = '', html = false) => {
  const title = document.createElement('h1');
  const container = getContainer('.content');
  html ? (title.innerHTML = message) : (title.innerText = message);
  container.insertBefore(title, container.firstChild);
};

const setLoading = (state = true) => {
  if (!spinner && state) {
    var opts = {
      lines: 13 // The number of lines to draw
      , length: 18 // The length of each line
      , width: 14 // The line thickness
      , radius: 42 // The radius of the inner circle
      , scale: 1 // Scales overall size of the spinner
      , corners: 1 // Corner roundness (0..1)
      , color: '#fff' // #rgb or #rrggbb or array of colors
      , opacity: 0.25 // Opacity of the lines
      , rotate: 0 // The rotation offset
      , direction: 1 // 1: clockwise, -1: counterclockwise
      , speed: 1 // Rounds per second
      , trail: 60 // Afterglow percentage
      , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
      , zIndex: 2e9 // The z-index (defaults to 2000000000)
      , className: 'spinner' // The CSS class to assign to the spinner
      , top: '50%' // Top position relative to parent
      , left: '50%' // Left position relative to parent
      , shadow: false // Whether to render a shadow
      , hwaccel: false // Whether to use hardware acceleration
      , position: 'absolute' // Element positioning
    }
    const target = document.getElementById('content-wrapper')
    spinner = new Spinner(opts).spin(target);
  }
  if (!state) {
    spinner.stop()
  }
}

const ready = () => {
  const { vote, campaignId, answer } = parseURL();
  setLoading();
  fetchCampaignData(campaignId, ({ error, campaign, campaigns, results }) => {
    setLoading(false);
    if (error) {
      alert('error');
      console.log('error', error); // eslint-disable-line no-console
    }
    if (campaigns) {
      activateCampaignsMenu(campaigns);
    }
    else if (results && campaign) {
      Object.keys(results).length ? drawResults('pie', results, campaign, answer) : printMessage('No results yet!');
    }
  }, (error) => {
    console.log('error', error); // eslint-disable-line no-console
  });
};

{
  if (document.readyState != 'loading'){
    ready();
  } else {
    document.addEventListener('DOMContentLoaded', ready);
  }
}
