const pool = require('../config/db');

const createRental = async (req, res) => {
  try {
    const { dressId, rentalDate, durationDays } = req.body;
    const [result] = await pool.query(
      'INSERT INTO rentals (dress_id, customer_id, rental_date, duration_days, status) VALUES (?, ?, ?, ?, ?)',
      [dressId, req.user.id, rentalDate, durationDays, 'pending']
    );
    res.status(201).json({ rentalId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create rental' });
  }
};

const getCustomerRentals = async (req, res) => {
  try {
    const [rentals] = await pool.query(
      `SELECT r.id, r.rental_date, r.duration_days, r.status, d.title AS dressTitle, d.price AS dressPrice,
              (r.duration_days * d.price) AS totalAmount
       FROM rentals r
       JOIN dresses d ON r.dress_id = d.id
       WHERE r.customer_id = ?`,
      [req.user.id]
    );
    res.json(rentals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load rentals' });
  }
};

module.exports = { createRental, getCustomerRentals };


