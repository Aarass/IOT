namespace EventManager;

public record SensorData(long id, string sensorId, DateTime datetime, float activeEnergy, float globalReactivePower, float voltage, float globalIntensity);

