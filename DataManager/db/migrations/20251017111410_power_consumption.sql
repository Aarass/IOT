-- migrate:up
create table power_consumption (
  id SERIAL PRIMARY KEY,
  sensor_id varchar(255) not null,
  datetime timestamp not null,
  active_energy real not null,
  global_reactive_power real not null,
  voltage real not null,
  global_intensity real not null
);

-- migrate:down
drop table if exists power_consumption;
