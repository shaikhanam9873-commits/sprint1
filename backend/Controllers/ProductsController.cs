using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly string connectionString;

    public ProductsController(IConfiguration config)
    {
        connectionString = config.GetConnectionString("DefaultConnection")!;
    }

    [HttpGet]
    public IActionResult GetAllProducts()
    {
        var products = new List<object>();

        using var connection = new SqlConnection(connectionString);
        connection.Open();

        var command = new SqlCommand("SELECT * FROM Products", connection);
        var reader = command.ExecuteReader();

        while (reader.Read())
        {
            products.Add(new
            {
                productId = (int)reader["ProductId"],
                name = reader["Name"].ToString(),
                description = reader["Description"].ToString(),
                price = (decimal)reader["Price"],
                imageUrl = reader["ImageUrl"].ToString(),
                stock = (int)reader["Stock"],
                section = reader["Section"].ToString(),
                category = reader["Category"].ToString()
            });
        }

        return Ok(products);
    }

    [HttpGet("{id}")]
    public IActionResult GetProduct(int id)
    {
        using var connection = new SqlConnection(connectionString);
        connection.Open();

        var command = new SqlCommand(
            "SELECT * FROM Products WHERE ProductId = @id",
            connection
        );

        command.Parameters.AddWithValue("@id", id);

        var reader = command.ExecuteReader();

        if (reader.Read())
        {
            return Ok(new
            {
                productId = (int)reader["ProductId"],
                name = reader["Name"].ToString(),
                description = reader["Description"].ToString(),
                price = (decimal)reader["Price"],
                imageUrl = reader["ImageUrl"].ToString(),
                stock = (int)reader["Stock"],
                section = reader["Section"].ToString(),
                category = reader["Category"].ToString()
            });
        }

        return NotFound();
    }
}