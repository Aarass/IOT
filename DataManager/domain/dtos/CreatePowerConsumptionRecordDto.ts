export interface CreatePowerConsumptionRecordDto {
  sensorId: string;
  datetime: Date;
  activeEnergy: number;
  globalReactivePower: number;
  voltage: number;
  globalIntensity: number;
}
