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
    public async Task<ActionResult> PostConsumption(CreateConsumption dto)
    {
        this.logger.LogInformation("Received post consumption report request:\n" + dto.ToString());
        this.logger.LogInformation("About to make grpc request");

        var reply = await client.PostPowerConsumptionAsync(new Gateway.PostPowerConsumptionRequest
        {
            SensorId = dto.SensorId,
            Datetime = Timestamp.FromDateTime(ToDateTime(dto.Date, dto.Time)),
            ActiveEnergy = dto.ActiveEnergy,
            GlobalReactivePower = dto.GlobalReactivePower,
            Voltage = dto.Voltage,
            GlobalIntensity = dto.GlobalIntensity,
        });

        this.logger.LogInformation("Sent grpc request");

        if (reply != null)
        {
            this.logger.LogInformation("Got reply:\n" + reply.ToString());
            return CreatedAtAction(nameof(PostConsumption), reply);
        }
        else
        {
            this.logger.LogError("Server did not returned object");
            return (ActionResult)Results.InternalServerError();
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetConsumption(long id)
    {
        var res = await client.GetPowerConsumptionAsync(new Gateway.GetPowerConsumptionRequest
        {
            Id = id.ToString()
        });

        return Ok(res);
    }

    [HttpPatch("{id}")]
    public async Task<ActionResult> UpdateConsumption(long id, UpdateConsumption dto)
    {
        var req = new Gateway.UpdatePowerConsumptionRequest();
        req.Id = id.ToString();

        if (dto.SensorId != null)
        {
            req.SensorId = dto.SensorId;
        }

        if (dto.Date != null && dto.Time != null)
        {
            req.Datetime = Timestamp.FromDateTime(ToDateTime(dto.Date, dto.Time));
        }

        if (dto.ActiveEnergy != null)
        {
            req.ActiveEnergy = dto.ActiveEnergy.Value;
        }

        if (dto.GlobalReactivePower != null)
        {
            req.GlobalReactivePower = dto.GlobalReactivePower.Value;
        }

        if (dto.Voltage != null)
        {
            req.Voltage = dto.Voltage.Value;
        }

        if (dto.GlobalIntensity != null)
        {
            req.GlobalIntensity = dto.GlobalIntensity.Value;
        }

        var reply = await client.UpdatePowerConsumptionAsync(req);

        if (reply != null)
        {
            return Ok(reply);
        }
        else
        {
            this.logger.LogError("Server did not returned object");
            return (ActionResult)Results.InternalServerError();
        }
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

    private DateTime ToDateTime(String date, String time)
    {
        var dateParts = date.Split('/');
        if (dateParts == null || dateParts.Length != 3)
        {
            throw new Exception("Something went wrong");
        }

        var timeParts = time.Split(':');
        if (timeParts == null || timeParts.Length != 3)
        {
            throw new Exception("Something went wrong");
        }

        return new DateTime(int.Parse(dateParts[2]), int.Parse(dateParts[1]), int.Parse(dateParts[0]), int.Parse(timeParts[0]), int.Parse(timeParts[1]), int.Parse(timeParts[2]), DateTimeKind.Utc);
    }
}
