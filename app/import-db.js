const fs = require('fs');
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: 'reseau.proxy.rlwy.net',
    user: 'root',
    password: 'aQiBqtDOwcRsncJbEWYwPfYxKuAaRkXq',
    port: 25435,
    database: 'railway',
    multipleStatements: true,
  });

  const sql = fs.readFileSync('E:/Downloads/sispak_jurusan.sql', 'utf8');
                      
  await connection.query(sql);
  console.log('Import berhasil!');

  await connection.end();
}

run().catch((err) => {
  console.error('Error:', err);
});