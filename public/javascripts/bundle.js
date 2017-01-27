'use strict';

var parseChartData = function parseChartData(_ref) {
  var results = _ref.results;

  var labels = Object.keys(results);
  var data = labels.map(function (label) {
    return results[label];
  });
  return {
    labels: labels,
    datasets: [{
      data: data
    }]
  };
};

var redirectWithCampaignId = function redirectWithCampaignId(cid, location) {
  var protocol = location.protocol,
      host = location.host,
      pathname = location.pathname;

  location.href = protocol + '//' + host + pathname + '?cid=' + cid;
};

var activateCampaignsMenu = function activateCampaignsMenu() {
  var campaignsMenu = document.getElementById('campaigns');
  if (campaignsMenu) {
    campaignsMenu.addEventListener('change', function () {
      var campaignId = campaignsMenu.querySelector(':checked').value;
      redirectWithCampaignId(campaignId, location);
    });
  }
};

var fetchChartData = function fetchChartData(cid, success) {
  $.ajax({
    type: 'GET',
    url: 'http://john.local:3000/api',
    data: { cid: cid },
    success: success,
    error: function error(xhr, type) {
      console.log('xhr', xhr); // eslint-disable-line no-console
      console.log('type', type); // eslint-disable-line no-console
    }
  });
};

var drawResults = function drawResults() {
  var chart = document.getElementById('chart');
  if (chart) {
    var cid = chart.getAttribute('data-cid');
    if (cid) {
      fetchChartData(cid, function (results) {
        console.log('results', results); // eslint-disable-line no-console
      });
    }
  }
};

$(function () {
  activateCampaignsMenu();
  drawResults();
});
