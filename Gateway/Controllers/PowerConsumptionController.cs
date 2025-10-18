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
        try
        {
            var reply = await client.PostPowerConsumptionAsync(new Gateway.PostPowerConsumptionRequest
            {
                SensorId = dto.SensorId,
                Datetime = Timestamp.FromDateTime(ToDateTime(dto.Date, dto.Time)),
                ActiveEnergy = dto.ActiveEnergy,
                GlobalReactivePower = dto.GlobalReactivePower,
                Voltage = dto.Voltage,
                GlobalIntensity = dto.GlobalIntensity,
            });

            if (reply != null)
            {
                return CreatedAtAction(nameof(PostConsumption), reply);
            }
            else
            {
                this.logger.LogError("Server did not return an object");
                return (ActionResult)Results.InternalServerError();
            }
        }
        catch (Exception err)
        {
            this.logger.LogError("Something went wrong while sending request");
            this.logger.LogError(err.ToString());
            return (ActionResult)Results.InternalServerError();
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetConsumption(long id)
    {
        try
        {
            var res = await client.GetPowerConsumptionAsync(new Gateway.GetPowerConsumptionRequest
            {
                Id = id.ToString()
            });

            return Ok(res);
        }
        catch (Exception err)
        {
            this.logger.LogError("Something went wrong while sending request");
            this.logger.LogError(err.ToString());
            return (ActionResult)Results.InternalServerError();
        }
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

        try
        {
            var reply = await client.UpdatePowerConsumptionAsync(req);

            if (reply != null)
            {
                return Ok(reply);
            }
            else
            {
                this.logger.LogError("Server did not return an object");
                return (ActionResult)Results.InternalServerError();
            }
        }
        catch (Exception err)
        {
            this.logger.LogError("Something went wrong while sending request");
            this.logger.LogError(err.ToString());
            return (ActionResult)Results.InternalServerError();
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteConsumption(long id)
    {

        try
        {
            var reply = await client.DeletePowerConsumptionAsync(new Gateway.DeletePowerConsumptionRequest
            {
                Id = id.ToString()
            });

            if (reply != null)
            {
                return Ok(reply);
            }
            else
            {
                this.logger.LogError("Server did not return an object");
                return (ActionResult)Results.InternalServerError();
            }
        }
        catch (Exception err)
        {
            this.logger.LogError("Something went wrong while sending request");
            this.logger.LogError(err.ToString());
            return (ActionResult)Results.InternalServerError();
        }
    }

    [HttpPost("avg/{id}")]
    public async Task<ActionResult> GetAvg(long id, Interval interval)
    {
        try
        {
            var reply = await client.GetAvgPowerConsumptionAsync(ToIdWithInterval(id, interval));

            if (reply != null)
            {
                return Ok(reply);
            }
            else
            {
                this.logger.LogError("Server did not return an object");
                return (ActionResult)Results.InternalServerError();
            }
        }
        catch (Exception err)
        {
            this.logger.LogError("Something went wrong while sending request");
            this.logger.LogError(err.ToString());
            return (ActionResult)Results.InternalServerError();
        }
    }

    [HttpPost("sum/{id}")]
    public async Task<ActionResult> GetSum(long id, Interval interval)
    {
        try
        {
            var reply = await client.GetSumPowerConsumptionAsync(ToIdWithInterval(id, interval));

            if (reply != null)
            {
                return Ok(reply);
            }
            else
            {
                this.logger.LogError("Server did not return an object");
                return (ActionResult)Results.InternalServerError();
            }
        }
        catch (Exception err)
        {
            this.logger.LogError("Something went wrong while sending request");
            this.logger.LogError(err.ToString());
            return (ActionResult)Results.InternalServerError();
        }
    }

    [HttpPost("min/{id}")]
    public async Task<ActionResult> GetMin(long id, Interval interval)
    {
        try
        {
            var reply = await client.GetMinPowerConsumptionAsync(ToIdWithInterval(id, interval));

            if (reply != null)
            {
                return Ok(reply);
            }
            else
            {
                this.logger.LogError("Server did not return an object");
                return (ActionResult)Results.InternalServerError();
            }
        }
        catch (Exception err)
        {
            this.logger.LogError("Something went wrong while sending request");
            this.logger.LogError(err.ToString());
            return (ActionResult)Results.InternalServerError();
        }
    }

    [HttpPost("max/{id}")]
    public async Task<ActionResult> GetMax(long id, Interval interval)
    {
        try
        {
            var reply = await client.GetMaxPowerConsumptionAsync(ToIdWithInterval(id, interval));

            if (reply != null)
            {
                return Ok(reply);
            }
            else
            {
                this.logger.LogError("Server did not return an object");
                return (ActionResult)Results.InternalServerError();
            }
        }
        catch (Exception err)
        {
            this.logger.LogError("Something went wrong while sending request");
            this.logger.LogError(err.ToString());
            return (ActionResult)Results.InternalServerError();
        }
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

    private IdWithInterval ToIdWithInterval(long id, Interval interval)
    {
        var res = new Gateway.IdWithInterval
        {
            Id = id.ToString()
        };

        if (interval.After != null)
        {
            res.After = Timestamp.FromDateTime(interval.After.Value);
        }

        if (interval.Before != null)
        {
            res.Before = Timestamp.FromDateTime(interval.Before.Value);
        }

        return res;
    }
}
