using First_App.Application;
using First_App.Infrastructure.Data;
using First_App.Infrastructure.Data.Seeding;
using First_App.WebApi;
using First_App.WebApi.Middlewares;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllerWithResultMapping();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.MapType<DateOnly>(() => new OpenApiSchema
    {
        Type = "string",
        Format = "date",
        Example = new OpenApiString(DateTime.Today.ToString("yyyy-MM-dd"))
    });
});

string? connectionString = builder.Configuration.GetConnectionString("LocalInstance");
ArgumentNullException.ThrowIfNullOrEmpty(connectionString);

builder.Services.AddAppDbContext(connectionString);
builder.Services.AddFluentValidators();
builder.Services.AddMapping();
builder.Services.AddHandlersAndBehaviour();
builder.Services.AddMapping();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Host.UseSerilog((context, configuration) => configuration.ReadFrom.Configuration(context.Configuration));

var app = builder.Build();

// using IServiceScope scope = app.Services.CreateScope();
// await using var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
// await RequiredDataSeeder.PopulateDbContext(dbContext);

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
