var fetch = require('node-fetch')

var BASE_PATH = 'https://liquidebleiben.codebeamer.com/api/v3'
var AUTH_HEADER = { 'Authorization': `Basic ${process.env.CB_BASIC_AUTH}` };

let offers = [];
let clusters = {
  column: undefined,
  names: [],
};
let displayedColumns = [];

const dropdowns = [
  {
    id: 1000,
    name: 'state',
    options: []
  },
  {
    id: 1001,
    name: 'trade',
    options: []
  },
]

async function retrieveOffers() {
  const cbOffers = await fetch(`${BASE_PATH}/trackers/2221/reports/3017/items?page=1&pageSize=500`, {
    method: 'GET',
    headers: AUTH_HEADER,
  })
    .then(res => res.json())
  offers = cbOffers.items.map(item => ({ name: item.item.name, fields: item.item.customFields }));
}

async function retrieveColumnsAndClusters() {
  const cbSchema = await fetch(`${BASE_PATH}/trackers/2221/schema`, {
    method: 'GET',
    headers: AUTH_HEADER,
  })
    .then(res => res.json())
  displayedColumns = cbSchema
    .filter(col => col.mandatoryInStatuses.findIndex(status => status.id === 8) > -1)
    .map(col => ({ id: col.id, name: col.name }));
  clusters.names = cbSchema.find(col => col.id === 1002).options.map(opt => opt.name).splice(1);
  clusters.column = cbSchema.find(col => col.id === 1002).name;
}

async function retrieveDropdownOptions(fieldId) {
  const dropdownValues = await fetch(`${BASE_PATH}/trackers/2221/fields/${fieldId}`, {
    method: 'GET',
    headers: AUTH_HEADER,
  }).then(res => res.json());
  return dropdownValues.options;
}

function getOffers() {
  return offers;
}

function getDropdowns() {
  return dropdowns;
}

function getColumns() {
  return displayedColumns;
}

function getClusters() {
  return clusters;
}

function refreshData() {
  retrieveOffers();
  retrieveColumnsAndClusters();
  dropdowns.forEach(dd => dd.options = retrieveDropdownOptions(dd.id));
}

setTimeout(refreshData, 1800000);
refreshData();

module.exports = {
  getClusters,
  getColumns,
  getDropdowns,
  getOffers
}