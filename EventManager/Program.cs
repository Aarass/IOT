using System.Text.Json;
using MQTTnet;
using EventManager;

var rand = new Random();

var client = await ConnectToBroker(Guid.NewGuid().ToString());
client.ApplicationMessageReceivedAsync += OnMesage;
await client.SubscribeAsync("powerConsumption");

var waiter = new TaskCompletionSource();
client.DisconnectedAsync += _ =>
{
    waiter.SetResult();
    return Task.CompletedTask;
};
await waiter.Task;

async Task OnMesage(MqttApplicationMessageReceivedEventArgs e)
{
    if (e.ApplicationMessage.Topic != "powerConsumption")
    {
        Console.WriteLine("Got message for unexpected topic: " + e.ApplicationMessage.Topic);
        return;
    }

    var payload = e.ApplicationMessage.ConvertPayloadToString();
    var data = JsonSerializer.Deserialize<SensorData>(payload);

    if (data == null)
    {
        Console.WriteLine("Couldn't deserialize the message");
        return;
    }

    if (rand.Next(0, 11) > 9)
    {
        await NotifyAbnormalValues(data);
    }

    return;
}

async Task NotifyAbnormalValues(SensorData data)
{
    var message = new MqttApplicationMessageBuilder()
        .WithTopic("abnormal")
        .WithPayload(JsonSerializer.Serialize(data))
        .Build();

    await client.PublishAsync(message);
}

async Task<IMqttClient> ConnectToBroker(string clientId)
{
    string host = Environment.GetEnvironmentVariable("MQTT_HOST") ?? "localhost";
    int port = int.Parse(Environment.GetEnvironmentVariable("MQTT_PORT") ?? "1883");

    var factory = new MqttClientFactory();
    var client = factory.CreateMqttClient();

    var connectResult = await client.ConnectAsync(new MqttClientOptionsBuilder()
        .WithTcpServer(host, port)
        .WithClientId(clientId)
        .WithCleanSession()
        .Build());

    if (connectResult.ResultCode != MqttClientConnectResultCode.Success)
    {
        Console.WriteLine($"Failed to connect to MQTT broker: {connectResult.ResultCode}");
        throw new Exception(connectResult.ToString());
    }

    Console.WriteLine("Connected to MQTT broker successfully.");

    return client;
}
