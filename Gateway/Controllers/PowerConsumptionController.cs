using Grpc.Net.Client;
using Microsoft.AspNetCore.Mvc;

namespace Gateway.Controllers;

[ApiController]
[Route("[controller]")]
public class PowerConsumptionController : ControllerBase
{
    private readonly ILogger<PowerConsumptionController> logger;

    public PowerConsumptionController(ILogger<PowerConsumptionController> logger)
    {
        this.logger = logger;
    }

    // [HttpGet(Name = "GetWeatherForecast")]
    // public IEnumerable<WeatherForecast> Get()
    // {
    // return Enumerable.Range(1, 5).Select(index => new WeatherForecast
    // {
    //     Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
    //     TemperatureC = Random.Shared.Next(-20, 55),
    //     Summary = Summaries[Random.Shared.Next(Summaries.Length)]
    // })
    // .ToArray();
    // }

    [HttpPost]
    public async Task<ActionResult> PostConsumption(Consumption consumption)
    {
        this.logger.LogInformation("Receiver consumption report:\n" + consumption.ToString());

        // // The port number must match the port of the gRPC server.
        using var channel = GrpcChannel.ForAddress("http://localhost:5000");
        var client = new Gateway.DataManager.DataManagerClient(channel);
        var reply = await client.PostPowerConsumptionAsync(new Gateway.PowerConsumptionReport
        {
            Date = "asdf",
            Time = "Asd",
            GlobalActivePower = "Asd",
            GlobalReactivePower = "Asd",
            Voltage = "Asd",
            GlobalIntensity = "Asd",
            Sub1 = "Asd",
            Sub2 = "Asd",
            Sub3 = "Asd",
        });

        this.logger.LogInformation("Sent rpc request");


        //    return CreatedAtAction("GetTodoItem", new { id = todoItem.Id }, todoItem);
        // return CreatedAtAction(nameof(GetTodoItem), new { id = todoItem.Id }, todoItem);
        return Ok();
    }
}
