using System.ComponentModel;
using System.Text;
using System.Text.Json.Serialization;

namespace Gateway;

public class Interval
{
    [JsonPropertyName("after")]
    public DateTime? After { get; set; }

    [JsonPropertyName("before")]
    public DateTime? Before { get; set; }


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
