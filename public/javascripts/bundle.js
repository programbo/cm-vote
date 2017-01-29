'use strict';

var getCampaignId = function getCampaignId() {
  var parsedSearch = location.search.match(/cid=([0-9a-f]{32})/i);
  if (parsedSearch && parsedSearch.length === 2) {
    return parsedSearch[1];
  }
};

var updateCampaginInfo = function updateCampaginInfo(campaign) {
  console.log('updateCampaginInfo', campaign); // eslint-disable-line no-console
};

var parseChartData = function parseChartData(results) {
  var labels = Object.keys(results);
  var data = labels.map(function (label) {
    return results[label];
  });
  return {
    labels: labels,
    datasets: [{
      data: data,
      backgroundColor: labels.map(function (label, index) {
        return 'hsl(300, 85%, ' + (100 - 15 * index) + '%)';
      }),
      borderWidth: labels.map(function () {
        return 4;
      }),
      borderColor: labels.map(function () {
        return 'hsl(300, 85%, 25%)';
      })
    }]
  };
};

var redirectWithCampaignId = function redirectWithCampaignId(cid, location) {
  var protocol = location.protocol,
      host = location.host,
      pathname = location.pathname;

  location.href = protocol + '//' + host + pathname + '?cid=' + cid;
};

var activateCampaignsMenu = function activateCampaignsMenu(campaigns) {
  var campaignsMenu = document.getElementById('campaigns');
  if (campaignsMenu) {
    campaigns.forEach(function (_ref) {
      var CampaignID = _ref.CampaignID,
          Name = _ref.Name,
          SentDate = _ref.SentDate;

      $('<option value="' + CampaignID + '">' + Name + ' (Sent ' + SentDate + ')</option>').appendTo(campaignsMenu);
    });
    campaignsMenu.style.display = 'block';
    campaignsMenu.addEventListener('change', function () {
      var campaignId = campaignsMenu.querySelector(':checked').value;
      redirectWithCampaignId(campaignId, location);
    });
  }
};

var fetchCampaignData = function fetchCampaignData() {
  var cid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var success = arguments[1];
  var error = arguments[2];

  $.ajax({
    type: 'GET',
    url: '/api',
    data: { cid: cid },
    success: success,
    error: error || function (xhr, type) {
      console.log('xhr', xhr); // eslint-disable-line no-console
      console.log('type', type); // eslint-disable-line no-console
    }
  });
};

var drawResults = function drawResults(type, results, _ref2) {
  var Name = _ref2.Name;

  var data = parseChartData(results);
  var myPieChart = new Chart('chart', {
    type: type,
    data: data,
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

$(function () {
  var campaignId = getCampaignId();
  fetchCampaignData(campaignId, function (_ref3) {
    var campaign = _ref3.campaign,
        campaigns = _ref3.campaigns,
        results = _ref3.results;

    if (campaigns) {
      activateCampaignsMenu(campaigns);
    } else if (results && campaign) {
      drawResults('pie', results, campaign);
    }
  });
});
