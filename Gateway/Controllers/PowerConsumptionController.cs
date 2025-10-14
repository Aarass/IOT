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
        // Console.WriteLine();
        // Console.WriteLine(consumption.Time.ToString());


        //    return CreatedAtAction("GetTodoItem", new { id = todoItem.Id }, todoItem);
        // return CreatedAtAction(nameof(GetTodoItem), new { id = todoItem.Id }, todoItem);
        return Ok();
    }
}
