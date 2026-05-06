const pool = require('../config/db');

const processPayment = async (req, res) => {
  try {
    const { rentalId, amount, paymentMethod } = req.body;

    const [rentals] = await pool.query('SELECT customer_id, status FROM rentals WHERE id = ?', [rentalId]);
    if (!rentals.length) {
      return res.status(404).json({ error: 'Rental not found' });
    }
    const rental = rentals[0];
    if (rental.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized payment attempt' });
    }

    await pool.query(
      'INSERT INTO payments (rental_id, amount, payment_method, status) VALUES (?, ?, ?, ?)',
      [rentalId, amount, paymentMethod || 'card', 'completed']
    );

    await pool.query('UPDATE rentals SET status = ? WHERE id = ?', ['confirmed', rentalId]);

    res.status(201).json({ message: 'Payment recorded' });
  } catch (error) {
    console.error('Payment error:', error.message || error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
};

module.exports = { processPayment };

