using System.ComponentModel;
using System.Text;
using System.Text.Json.Serialization;

namespace Gateway;

public class CreateConsumption
{
    [JsonPropertyName("sensor_id")]
    public required String SensorId { get; set; }

    [JsonPropertyName("date")]
    public required String Date { get; set; }

    [JsonPropertyName("time")]
    public required String Time { get; set; }

    [JsonPropertyName("active_energy")]
    public required float ActiveEnergy { get; set; }

    [JsonPropertyName("global_reactive_power")]
    public required float GlobalReactivePower { get; set; }

    [JsonPropertyName("voltage")]
    public required float Voltage { get; set; }

    [JsonPropertyName("global_intensity")]
    public required float GlobalIntensity { get; set; }

    public override string ToString()
    {
        StringBuilder builder = new StringBuilder();
        foreach (PropertyDescriptor pd in TypeDescriptor.GetProperties(this))
        {
            builder.Append(string.Format("{0}: {1}\n", pd.Name, pd.GetValue(this)?.ToString()));
        }
        return builder.ToString();
    }
}
