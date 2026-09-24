using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly string connectionString;

    public UsersController(IConfiguration config)
    {
        connectionString = config.GetConnectionString("DefaultConnection")!;
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequest request)
    {
        using var connection = new SqlConnection(connectionString);
        connection.Open();

        var checkCommand = new SqlCommand("SELECT COUNT(*) FROM Users WHERE Email = @email", connection);
        checkCommand.Parameters.AddWithValue("@email", request.Email);
        int count = (int)checkCommand.ExecuteScalar()!;

        if (count > 0)
        {
            return BadRequest(new { message = "An account with this email already exists." });
        }

        var insertCommand = new SqlCommand(
            "INSERT INTO Users (Username, Email, Password) VALUES (@username, @email, @password)",
            connection);
        insertCommand.Parameters.AddWithValue("@username", request.Username);
        insertCommand.Parameters.AddWithValue("@email", request.Email);
        insertCommand.Parameters.AddWithValue("@password", request.Password);
        insertCommand.ExecuteNonQuery();

        return Ok(new { message = "Registration successful." });
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        using var connection = new SqlConnection(connectionString);
        connection.Open();

        var command = new SqlCommand(
            "SELECT UserId, Username, Email FROM Users WHERE Email = @email AND Password = @password",
            connection);
        command.Parameters.AddWithValue("@email", request.Email);
        command.Parameters.AddWithValue("@password", request.Password);

        var reader = command.ExecuteReader();

        if (reader.Read())
        {
            return Ok(new
            {
                userId   = (int)reader["UserId"],
                username = reader["Username"].ToString(),
                email    = reader["Email"].ToString()
            });
        }

        return Unauthorized(new { message = "Invalid email or password." });
    }
}

public class RegisterRequest
{
    public string Username { get; set; } = "";
    public string Email    { get; set; } = "";
    public string Password { get; set; } = "";
}

public class LoginRequest
{
    public string Email    { get; set; } = "";
    public string Password { get; set; } = "";
}
