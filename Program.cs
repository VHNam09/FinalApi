using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MovieApi.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<GenresContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("MovieContext")));

// Cấu hình CORS đúng cách
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins(
                "http://127.0.0.1:5500",
                "http://127.0.0.1:5501",
                "https://localhost:7186")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Thêm dòng này nếu cần xác thực qua CORS
    });
});

// Cấu hình JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],  // Thêm vào appsettings.json
            ValidAudience = builder.Configuration["Jwt:Audience"],  // Thêm vào appsettings.json
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"])) // Thêm vào appsettings.json
        };
    });

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseDeveloperExceptionPage();

app.UseRouting();
// Áp dụng CORS - QUAN TRỌNG: Phải đặt trước UseAuthorization
app.UseCors("AllowLocalhost");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();