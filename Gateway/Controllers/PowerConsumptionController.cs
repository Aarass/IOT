using Microsoft.AspNetCore.Mvc;
using Google.Protobuf.WellKnownTypes;

namespace Gateway.Controllers;

[ApiController]
[Route("[controller]")]
public class PowerConsumptionController : ControllerBase
{
    private readonly Gateway.DataManager.DataManagerClient client;
    private readonly ILogger<PowerConsumptionController> logger;

    public PowerConsumptionController(Gateway.DataManager.DataManagerClient client, ILogger<PowerConsumptionController> logger)
    {
        this.client = client;
        this.logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult> PostConsumption(Consumption consumption)
    {
        this.logger.LogInformation("Received post consumption report request:\n" + consumption.ToString());

        var dateParts = consumption.Date.Split('/');
        if (dateParts == null || dateParts.Length != 3)
        {
            throw new Exception("Something went wrong");
        }

        var timeParts = consumption.Time.Split(':');
        if (timeParts == null || timeParts.Length != 3)
        {
            throw new Exception("Something went wrong");
        }

        var date = new DateTime(int.Parse(dateParts[2]), int.Parse(dateParts[1]), int.Parse(dateParts[0]), int.Parse(timeParts[0]), int.Parse(timeParts[1]), int.Parse(timeParts[2]), DateTimeKind.Utc);

        this.logger.LogInformation("About to make grpc request");
        var reply = await client.PostPowerConsumptionAsync(new Gateway.PostPowerConsumptionRequest
        {
            SensorId = consumption.SensorId,
            Datetime = Timestamp.FromDateTime(date),
            ActiveEnergy = consumption.ActiveEnergy,
            GlobalReactivePower = consumption.GlobalReactivePower,
            Voltage = consumption.Voltage,
            GlobalIntensity = consumption.GlobalIntensity,
        });
        this.logger.LogInformation("Sent grpc request");

        if (reply != null)
        {
            this.logger.LogInformation("Got reply:\n" + reply.ToString());
        }
        else
        {
            throw new Exception("Server did not return an object");
        }

        // return Ok();
        return CreatedAtAction(nameof(PostConsumption), reply);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetConsumption(long id)
    {
        this.logger.LogInformation("Http get id: " + id);
        return Ok();
    }

    [HttpPatch("{id}")]
    public async Task<ActionResult> UpdateConsumption(long id)
    {
        this.logger.LogInformation("Http update id: " + id);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteConsumption(long id)
    {
        this.logger.LogInformation("Http delete id: " + id);
        return Ok();
    }


    [HttpPost("avg")]
    public async Task<ActionResult> GetAvg(Interval interval)
    {
        this.logger.LogInformation("Avg req");
        return Ok();
    }

    [HttpPost("sum")]
    public async Task<ActionResult> GetSum(Interval interval)
    {
        this.logger.LogInformation("Sum req");
        return Ok();
    }

    [HttpPost("min")]
    public async Task<ActionResult> GetMin(Interval interval)
    {
        this.logger.LogInformation("Min req");
        return Ok();
    }

    [HttpPost("max")]
    public async Task<ActionResult> GetMax(Interval interval)
    {
        this.logger.LogInformation("Max req");
        return Ok();
    }
}
