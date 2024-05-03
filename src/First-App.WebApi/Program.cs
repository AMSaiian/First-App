using First_App.Application;
using First_App.Infrastructure.Data;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
string? connectionString = builder.Configuration.GetConnectionString("LocalInstance");
ArgumentNullException.ThrowIfNullOrEmpty(connectionString);

builder.Services.AddAppDbContext(connectionString);
builder.Services.AddFluentValidators();
builder.Services.AddMapping();
builder.Services.AddHandlersAndBehaviour();
builder.Services.AddMapping();
builder.Host.UseSerilog((context, configuration) => configuration.ReadFrom.Configuration(context.Configuration));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers().RequireCors();

app.Run();
