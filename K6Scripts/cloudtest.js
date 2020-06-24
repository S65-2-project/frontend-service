
import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  duration: '1m',
  vus: 50,
  distribution: {
    scenarioLabel1: { loadZone: 'amazon:us:portland', percent: 25 },
    scenarioLabel2: { loadZone: 'amazon:gb:london', percent: 25 },
    scenarioLabel2: { loadZone: 'amazon:jp:tokyo', percent: 25 },
    scenarioLabel2: { loadZone: 'amazon:au:sydney', percent: 25 },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  const res = http.get('https://develop.delegate-market.nl');
  sleep(1);
}