using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly string connectionString;

    public OrdersController(IConfiguration config)
    {
        connectionString = config.GetConnectionString("DefaultConnection")!;
    }

    [HttpPost]
    public IActionResult PlaceOrder([FromBody] PlaceOrderRequest request)
    {
        using var connection = new SqlConnection(connectionString);
        connection.Open();

        var orderCommand = new SqlCommand(
            "INSERT INTO Orders (UserId, TotalAmount, Status) OUTPUT INSERTED.OrderId VALUES (@userId, @total, 'Pending')",
            connection);
        orderCommand.Parameters.AddWithValue("@userId", request.UserId);
        orderCommand.Parameters.AddWithValue("@total", request.TotalAmount);

        int orderId = (int)orderCommand.ExecuteScalar()!;

        foreach (var item in request.Items)
        {
            var itemCommand = new SqlCommand(
                "INSERT INTO OrderItems (OrderId, ProductId, Quantity, Price) VALUES (@orderId, @productId, @qty, @price)",
                connection);
            itemCommand.Parameters.AddWithValue("@orderId",    orderId);
            itemCommand.Parameters.AddWithValue("@productId",  item.ProductId);
            itemCommand.Parameters.AddWithValue("@qty",        item.Quantity);
            itemCommand.Parameters.AddWithValue("@price",      item.Price);
            itemCommand.ExecuteNonQuery();
        }

        return Ok(new { message = "Order placed successfully!", orderId = orderId });
    }

    [HttpGet("{userId}")]
    public IActionResult GetUserOrders(int userId)
    {
        var orders = new List<object>();

        using var connection = new SqlConnection(connectionString);
        connection.Open();

        var command = new SqlCommand(
            "SELECT * FROM Orders WHERE UserId = @userId ORDER BY CreatedAt DESC",
            connection);
        command.Parameters.AddWithValue("@userId", userId);

        var reader = command.ExecuteReader();

        while (reader.Read())
        {
            orders.Add(new
            {
                orderId     = (int)reader["OrderId"],
                totalAmount = (decimal)reader["TotalAmount"],
                status      = reader["Status"].ToString(),
                createdAt   = reader["CreatedAt"].ToString()
            });
        }

        return Ok(orders);
    }
}

public class PlaceOrderRequest
{
    public int UserId              { get; set; }
    public decimal TotalAmount     { get; set; }
    public List<OrderItemRequest> Items { get; set; } = new List<OrderItemRequest>();
}

public class OrderItemRequest
{
    public int ProductId   { get; set; }
    public int Quantity    { get; set; }
    public decimal Price   { get; set; }
}
