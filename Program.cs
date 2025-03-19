using Microsoft.EntityFrameworkCore;
using MovieApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<GenresContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("MovieContext")));

// Cấu hình CORS chỉ 1 lần
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://127.0.0.1:5501/") // Cho phép FE chạy từ Live Server (VS Code)
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
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

// Đặt UseCors trước UseAuthorization
app.UseCors(MyAllowSpecificOrigins);
app.UseAuthorization();


app.MapControllers();

app.Run();


//using Microsoft.EntityFrameworkCore;
//using MovieApi.Data;

//var builder = WebApplication.CreateBuilder(args);

//// Add services to the container
//builder.Services.AddControllersWithViews();
//builder.Services.AddDbContext<MovieContext>(opt =>
//    opt.UseSqlServer(builder.Configuration.GetConnectionString("MovieContext")));

//// Thêm CORS chỉ 1 lần ở đây
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowAll",
//        policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
//});

//builder.Services.AddControllers();
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();
//builder.Services.AddHttpClient();

//var app = builder.Build();

//// Configure the HTTP request pipeline
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//app.UseHttpsRedirection();
//app.UseDeveloperExceptionPage();

//// Áp dụng CORS trước khi Authorization
//app.UseCors("AllowAll");

//app.UseAuthorization();

//// Cho phép chạy file tĩnh (HTML, CSS, JS)
//app.UseDefaultFiles();
//app.UseStaticFiles();

//// Điều hướng tới file HTML frontend
//app.MapGet("/", () => Results.Redirect("/pages/htmlpage.html"));

//app.MapControllers();

//app.Run();
