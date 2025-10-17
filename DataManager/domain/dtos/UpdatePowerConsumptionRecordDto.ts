export interface UpdatePowerConsumptionRecordDto {
  id: string;
  sensorId?: string;
  datetime?: Date;
  activeEnergy?: number;
  globalReactivePower?: number;
  voltage?: number;
  globalIntensity?: number;
}
