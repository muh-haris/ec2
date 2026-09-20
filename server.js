const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "mysql",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "product_db",
});

// Connect to MySQL
function connectDatabase() {
  db.connect((err) => {
    if (err) {
      console.error("Database connection failed:", err.message);

      // Retry after 5 seconds because MySQL container
      // may still be starting
      setTimeout(connectDatabase, 5000);
      return;
    }

    console.log("Connected to MySQL database");
  });
}

connectDatabase();

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Product CRUD API is running ",
  });
});

// GET all products
app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error fetching products",
        error: err.message,
      });
    }

    res.status(200).json(results);
  });
});

// GET single product
app.get("/products/:id", (req, res) => {
  const id = req.params.id;

  const sql = "SELECT * FROM products WHERE product_id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error fetching product",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(results[0]);
  });
});

// CREATE product
app.post("/products", (req, res) => {
  const { product_name, category, price, quantity } = req.body;

  if (
    !product_name ||
    !category ||
    price === undefined ||
    quantity === undefined
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const sql = `
    INSERT INTO products
    (product_name, category, price, quantity)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [product_name, category, price, quantity],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Error creating product",
          error: err.message,
        });
      }

      res.status(201).json({
        message: "Product created successfully",
        product_id: result.insertId,
        product_name,
        category,
        price,
        quantity,
      });
    }
  );
});

// UPDATE product
app.put("/products/:id", (req, res) => {
  const id = req.params.id;

  const { product_name, category, price, quantity } = req.body;

  if (
    !product_name ||
    !category ||
    price === undefined ||
    quantity === undefined
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const sql = `
    UPDATE products
    SET
      product_name = ?,
      category = ?,
      price = ?,
      quantity = ?
    WHERE product_id = ?
  `;

  db.query(
    sql,
    [product_name, category, price, quantity, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Error updating product",
          error: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.status(200).json({
        message: "Product updated successfully",
      });
    }
  );
});

// DELETE product
app.delete("/products/:id", (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM products WHERE product_id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error deleting product",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});