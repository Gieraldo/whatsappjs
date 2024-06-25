// haproxyMetrics.js
const { DateTime } = require('luxon'); // Mengimpor DateTime dari Luxon

function getProxy(current_time) {
  const now = DateTime.now().setZone('Asia/Jakarta');
  const formattedWIB = now.toFormat('HH:mm \'WIB\''); // Format jam menit dan tambahkan 'WIB'

  const output = `
Berikut Capture Response Code pada *router-internet*
*OCP-DC-BRImo* Jam *${formattedWIB}*
_response code 5xx total=$0_
  `;
  return output;
}

module.exports = { getProxy };
