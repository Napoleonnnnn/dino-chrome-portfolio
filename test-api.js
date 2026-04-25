import handler from './dist-api/index.js';
const req = { method: 'GET', query: { all: 'true' }, headers: {} };
const res = { 
  setHeader: () => {}, 
  status: (code) => { console.log('Status:', code); return res; }, 
  json: (data) => { console.log('JSON:', data); return res; } 
};
handler(req, res).then(() => console.log('Done')).catch(console.error);
