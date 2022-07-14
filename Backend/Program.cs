using System.Text;
using Backend.Data;
using Backend.Extensions;
using Backend.Helpers;
using Backend.Interfaces;
using Backend.Middleware;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

////46. Adding the authentication middleware
var config = builder.Configuration;

// Add services to the container.




// //43.Adding token service
// builder.Services.AddScoped<ITokenService, TokenService>();

// //13.Adding a DbContext class
// builder.Services.AddDbContext<DataContext>(options => {
//     options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
// });

//47. Adding extension methods
builder.Services.AddApplicationServicesFromExtension(config);


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

//builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerServicesFromExtension();


// ////46. Adding the authentication middleware
// builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//     .AddJwtBearer(options => {
//         options.TokenValidationParameters = new TokenValidationParameters{
//             ValidateIssuerSigningKey = true,
//             IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Token:Key"])),
//             ValidIssuer = config["Token:Issuer"],
//             ValidateIssuer = true,
//             ValidateAudience = false
//         };
//     });

//47. Adding extension methods
builder.Services.AddIdentityServiceFromExtension(config);



var app = builder.Build();

////use static images after add http photo resolver
app.UseStaticFiles();

//78.
app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // app.UseSwagger();
    // app.UseSwaggerUI();
    app.UseSwaggerDocumentation();
}


app.UseHttpsRedirection();


////90-91: Seeding data
using var scope = app.Services.CreateAsyncScope();
var services = scope.ServiceProvider;
ILogger logger = app.Logger;
//var loggerFactory = services.GetRequiredService<ILoggerFactory>;
try 
{
    //28. Applying the migrations and creating the Database at app startup
    var dbContext = services.GetRequiredService<DataContext>();
    await dbContext.Database.MigrateAsync();
    //29. Adding Seed data
    await Seed.SeedUsers(dbContext);
}
catch (Exception ex)
{
    logger.LogError(ex, "An error occurred during migration");
}

////25. Adding CORS Support to the API
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200"));

///46. Adding the authentication middleware
app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
