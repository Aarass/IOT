using System.ComponentModel;
using System.Text;
using System.Text.Json.Serialization;

namespace Gateway;

public class UpdateConsumption
{
    [JsonPropertyName("sensor_id")]
    public String? SensorId { get; set; }

    [JsonPropertyName("date")]
    public String? Date { get; set; }

    [JsonPropertyName("time")]
    public String? Time { get; set; }

    [JsonPropertyName("active_energy")]
    public float? ActiveEnergy { get; set; }

    [JsonPropertyName("global_reactive_power")]
    public float? GlobalReactivePower { get; set; }

    [JsonPropertyName("voltage")]
    public float? Voltage { get; set; }

    [JsonPropertyName("global_intensity")]
    public float? GlobalIntensity { get; set; }

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
