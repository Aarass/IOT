using Microsoft.AspNetCore.Mvc;

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
        this.logger.LogInformation("Receiver consumption report:\n" + consumption.ToString());

        await this.SendTestGrpc();

        // return CreatedAtAction("GetTodoItem", new { id = todoItem.Id }, todoItem);
        // return CreatedAtAction(nameof(GetTodoItem), new { id = todoItem.Id }, todoItem);
        return Ok();
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

    private async Task SendTestGrpc()
    {
        var reply = await client.PostPowerConsumptionAsync(new Gateway.PostPowerConsumptionRequest
        {
            Datetime = new Google.Protobuf.WellKnownTypes.Timestamp(),
            ActiveEnergy = 50f,
            GlobalReactivePower = .05f,
            Voltage = 240f,
            GlobalIntensity = 10f,
        });

        this.logger.LogInformation("Sent rpc request");
    }
}
