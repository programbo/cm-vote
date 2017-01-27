export const removeOldVotes = (votes) => votes.reduce((urls, { URL, EmailAddress, Date }) => {
  const data = { EmailAddress, Date };
  urls[URL] ? urls[URL].push(data) : (urls[URL] = [data]);
  return urls;
}, {});

export const removeMultipleVotes = (clicks) => {
  const votes = {};
  clicks.forEach((click) => {
    votes[click.EmailAddress] = click;
  });
  return Object.keys(votes).map((email) => votes[email]);
};

export const tallyVotes = (urls) => Object.keys(urls).reduce((votes, url) => {
  votes[url.split('/').pop()] = urls[url].length;
  return votes;
}, {});
