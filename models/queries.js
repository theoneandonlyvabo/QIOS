// Sample queries for reference

const queries = {
    // Users
    createUser: `
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, username, email
    `,
    
    // Products
    createProduct: `
        INSERT INTO products (name, description, price, stock_quantity)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `,
    
    updateProduct: `
        UPDATE products
        SET name = $1, description = $2, price = $3, stock_quantity = $4,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *
    `,
    
    // Orders
    createOrder: `
        INSERT INTO orders (user_id, total_amount, status)
        VALUES ($1, $2, $3)
        RETURNING *
    `,
    
    addOrderItem: `
        INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `,
    
    // Complex Queries
    getOrderWithItems: `
        SELECT 
            o.*,
            json_agg(json_build_object(
                'id', oi.id,
                'product_id', oi.product_id,
                'quantity', oi.quantity,
                'price', oi.price_at_time
            )) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.id = $1
        GROUP BY o.id
    `,
    
    getUserOrders: `
        SELECT 
            o.*,
            json_agg(json_build_object(
                'id', oi.id,
                'product_id', oi.product_id,
                'quantity', oi.quantity,
                'price', oi.price_at_time,
                'product', json_build_object(
                    'id', p.id,
                    'name', p.name,
                    'description', p.description
                )
            )) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC
    `
};

module.exports = queries;