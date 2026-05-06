const bcrypt = require('bcryptjs');
const pool = require('./config/db');

(async () => {
  try {
    const [existingDresses] = await pool.query('SELECT COUNT(*) AS c FROM dresses');
    if (existingDresses[0].c > 0) {
      console.log('Dresses already seeded.');
      await pool.end();
      return;
    }

    const [existingVendor] = await pool.query("SELECT id FROM users WHERE role = 'vendor' LIMIT 1");
    let vendorId;
    if (existingVendor.length) {
      vendorId = existingVendor[0].id;
    } else {
      const hashedPassword = await bcrypt.hash('Vendor123', 10);
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Sample Vendor', 'vendor@example.com', hashedPassword, 'vendor']
      );
      vendorId = result.insertId;
      console.log('Created vendor user with id', vendorId);
    }

    const sampleDresses = [
      ['Velvet Evening Dress', 'A luxurious velvet gown for evening events.', 65.00, vendorId],
      ['Floral Cocktail Dress', 'Bright floral dress perfect for cocktail parties.', 45.00, vendorId],
      ['Bridal Luxe', 'Elegant bridal gown with delicate lace details.', 120.00, vendorId],
      ['Couture Mini Dress', 'Fashion-forward mini dress for special nights out.', 55.00, vendorId],
    ];

    for (const [title, description, price, id] of sampleDresses) {
      await pool.query(
        'INSERT INTO dresses (vendor_id, title, description, price) VALUES (?, ?, ?, ?)',
        [vendorId, title, description, price]
      );
    }

    console.log('Inserted sample dresses.');
    await pool.end();
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
})();
