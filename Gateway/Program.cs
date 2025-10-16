string port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
string grpcServerAddr = Environment.GetEnvironmentVariable("GRPC_SERVER") ?? "http://localhost:5001";

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

builder.Services.AddControllers();
builder.Services.AddOpenApi(); // https://aka.ms/aspnet/openapi

builder.Services.AddGrpcClient<Gateway.DataManager.DataManagerClient>(o =>
{
    o.Address = new Uri(grpcServerAddr);
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUi(options =>
    {
        options.DocumentPath = "/openapi/v1.json";
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
