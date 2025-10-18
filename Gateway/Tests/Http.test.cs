using System.Diagnostics;
using Gateway.Controllers;
using Grpc.Net.Client;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Abstractions;

namespace Gateway
{
    public class HttpTests
    {
        public PowerConsumptionController controller;

        public HttpTests(String grpcServerAddr)
        {
            var channel = GrpcChannel.ForAddress(new Uri(grpcServerAddr));
            var client = new Gateway.DataManager.DataManagerClient(channel);

            var logger = LoggerFactory.Create(builder =>
            {
                builder.AddConsole();
            }).CreateLogger<PowerConsumptionController>();

            var logger2 = NullLogger<PowerConsumptionController>.Instance;

            controller = new PowerConsumptionController(client, logger2);
        }

        public async Task Test()
        {
            await Test1();
            await Test2();
            await Test3();
            PrintSuccess();
        }

        private async Task Test1()
        {
            var sensorId = Guid.NewGuid();

            var created = ToConsumption(await controller.PostConsumption(new CreateConsumption
            {
                SensorId = sensorId.ToString(),
                Date = "30/5/2025",
                Time = "10:30:05",
                ActiveEnergy = 10,
                GlobalReactivePower = 0.1f,
                Voltage = 239.7f,
                GlobalIntensity = 12.3f,
            }));


            var gottten = ToConsumption(await controller.GetConsumption(long.Parse(created.Id)));

            Debug.Assert(created.Equals(gottten), "Result from post and get must be the same");

            var updated = ToConsumption(await controller.UpdateConsumption(long.Parse(created.Id), new UpdateConsumption
            {
                ActiveEnergy = 100,
                GlobalReactivePower = 1f,
                Voltage = 139.7f,
                GlobalIntensity = 120.3f,
            }));

            Debug.Assert(updated.ActiveEnergy.Equals(100), "Updated value must be applied in result");
            Debug.Assert(updated.GlobalReactivePower.Equals(1f), "Updated value must be applied in result");
            Debug.Assert(updated.Voltage.Equals(139.7f), "Updated value must be applied in result");
            Debug.Assert(updated.GlobalIntensity.Equals(120.3f), "Updated value must be applied in result");

            var gottten2 = ToConsumption(await controller.GetConsumption(long.Parse(created.Id)));
            Debug.Assert(updated.Equals(gottten2), "Result from update and get must be the same");

            var deleted = ToConsumption(await controller.DeleteConsumption(long.Parse(created.Id)));
            Debug.Assert(updated.Equals(gottten2), "Result from delete and get must be the same");

            try
            {
                var gottten3 = ToConsumption(await controller.GetConsumption(long.Parse(created.Id)));
                Debug.Assert(false, "This should be unreachable. Get should fail.");
                // TODO - ovo fail-uje na pogresan nacin - manager treba to bolje da handle-a
            }
            catch { }
        }

        private async Task Test2()
        {
            var sensorId = Guid.NewGuid();

            var created1 = ToConsumption(await controller.PostConsumption(new CreateConsumption
            {
                SensorId = sensorId.ToString(),
                Date = "30/5/2025",
                Time = "10:30:05",
                ActiveEnergy = 4,
                GlobalReactivePower = 3,
                Voltage = 2,
                GlobalIntensity = 1,
            }));

            var created2 = ToConsumption(await controller.PostConsumption(new CreateConsumption
            {
                SensorId = sensorId.ToString(),
                Date = "30/6/2025",
                Time = "10:30:05",
                ActiveEnergy = 1,
                GlobalReactivePower = 2,
                Voltage = 3,
                GlobalIntensity = 4,
            }));


            var avg = ToConsumptionValues(await controller.GetAvg(sensorId.ToString(), new Interval()));
            Debug.Assert(avg.ActiveEnergy == 2.5f);
            Debug.Assert(avg.GlobalReactivePower == 2.5f);
            Debug.Assert(avg.Voltage == 2.5f);
            Debug.Assert(avg.GlobalIntensity == 2.5f);

            var sum = ToConsumptionValues(await controller.GetSum(sensorId.ToString(), new Interval()));
            Debug.Assert(sum.ActiveEnergy == 5);
            Debug.Assert(sum.GlobalReactivePower == 5);
            Debug.Assert(sum.Voltage == 5);
            Debug.Assert(sum.GlobalIntensity == 5);

            var min = ToConsumptionValues(await controller.GetMin(sensorId.ToString(), new Interval()));
            Debug.Assert(min.ActiveEnergy == 1);
            Debug.Assert(min.GlobalReactivePower == 2);
            Debug.Assert(min.Voltage == 2);
            Debug.Assert(min.GlobalIntensity == 1);

            var max = ToConsumptionValues(await controller.GetMax(sensorId.ToString(), new Interval()));
            Debug.Assert(max.ActiveEnergy == 4);
            Debug.Assert(max.GlobalReactivePower == 3);
            Debug.Assert(max.Voltage == 3);
            Debug.Assert(max.GlobalIntensity == 4);
        }

        private async Task Test3()
        {
            var sensorId = Guid.NewGuid();

            var created1 = ToConsumption(await controller.PostConsumption(new CreateConsumption
            {
                SensorId = sensorId.ToString(),
                Date = "30/5/2023",
                Time = "10:30:05",
                ActiveEnergy = 4,
                GlobalReactivePower = 4,
                Voltage = 4,
                GlobalIntensity = 4,
            }));

            var created2 = ToConsumption(await controller.PostConsumption(new CreateConsumption
            {
                SensorId = sensorId.ToString(),
                Date = "30/6/2025",
                Time = "10:30:05",
                ActiveEnergy = 1,
                GlobalReactivePower = 1,
                Voltage = 1,
                GlobalIntensity = 1,
            }));

            var avg = ToConsumptionValues(await controller.GetAvg(sensorId.ToString(), new Interval
            {
                After = new DateTime(2024, 1, 1, 1, 1, 1, 1, DateTimeKind.Utc)
            }));

            Debug.Assert(avg.ActiveEnergy == 1);
            Debug.Assert(avg.GlobalReactivePower == 1);
            Debug.Assert(avg.Voltage == 1);
            Debug.Assert(avg.GlobalIntensity == 1);

            var sum = ToConsumptionValues(await controller.GetSum(sensorId.ToString(), new Interval
            {
                Before = new DateTime(2024, 1, 1, 1, 1, 1, 1, DateTimeKind.Utc)
            }));

            Debug.Assert(sum.ActiveEnergy == 4);
            Debug.Assert(sum.GlobalReactivePower == 4);
            Debug.Assert(sum.Voltage == 4);
            Debug.Assert(sum.GlobalIntensity == 4);
        }

        private PowerConsumption ToConsumption(ActionResult? _res)
        {
            if (_res is ActionResult res)
            {
                if ((PowerConsumption?)((ObjectResult)res).Value is PowerConsumption pc)
                {
                    return pc;
                }
            }

            throw new Exception("Not a PowerConsumption");
        }

        private PowerConsumptionValues ToConsumptionValues(ActionResult? _res)
        {
            if (_res is ActionResult res)
            {
                if ((PowerConsumptionValues?)((ObjectResult)res).Value is PowerConsumptionValues pc)
                {
                    return pc;
                }
            }

            throw new Exception("Not a PowerConsumption");
        }

        private void PrintSuccess()
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("All tests passed!");
            Console.ResetColor();
        }

    }
}
