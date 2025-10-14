using System.ComponentModel;
using System.Text;
using System.Text.Json.Serialization;

namespace Gateway;

public class Consumption
{
    [JsonPropertyName("date")]
    public required String Date { get; set; }

    [JsonPropertyName("time")]
    public required String Time { get; set; }

    [JsonPropertyName("global_active_power")]
    public required String GlobalActivePower { get; set; }

    [JsonPropertyName("global_reactive_power")]
    public required String GlobalReactivePower { get; set; }

    [JsonPropertyName("voltage")]
    public required String Voltage { get; set; }

    [JsonPropertyName("global_intensity")]
    public required String GlobalIntensity { get; set; }

    [JsonPropertyName("sub1")]
    public required String Sub1 { get; set; }

    [JsonPropertyName("sub2")]
    public required String Sub2 { get; set; }

    [JsonPropertyName("sub3")]
    public required String Sub3 { get; set; }

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
