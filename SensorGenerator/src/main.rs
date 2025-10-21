use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;
use std::thread::sleep;
use std::time::Duration;

use serde_json::json;

fn main() -> std::io::Result<()> {
    let args = Args::parse();

    let file = File::open(args.input_file)?;
    let reader = BufReader::new(file);

    let http_client = reqwest::blocking::Client::new();

    for maybe_line in reader
        .lines()
        .skip(args.skip as usize)
        .take(if args.take > 0 {
            args.take as usize
        } else {
            usize::MAX
        })
    {
        if let Ok(line) = maybe_line {
            if line.contains('?') {
                continue;
            }

            if let Ok(record) = Record::try_from(line) {
                let active_energy = record.global_active_power * 1000.0 / 60.0
                    - record.sub1
                    - record.sub2
                    - record.sub3;

                let req = http_client
                    .post(format!("{}/powerconsumption", args.gateway_addr))
                    .json(&json!({
                        "sensor_id": args.id,
                        "date": record.date,
                        "time": record.time,
                        "active_energy": active_energy,
                        "global_reactive_power": record.global_reactive_power,
                        "voltage": record.voltage,
                        "global_intensity": record.global_intensity,
                    }));

                match req.send() {
                    Ok(response) => {
                        println!("Got response");

                        if response.status().is_success() {
                            println!("Success");
                        } else if response.status().is_server_error() {
                            println!("Server Error");
                        } else {
                            println!("Something went wrong");
                        }

                        println!(
                            "Response: {}",
                            response.text().unwrap_or("No response text".to_owned())
                        );

                        sleep(Duration::from_millis(args.sleep));
                    }
                    Err(err) => {
                        dbg!(err);
                    }
                }
            } else {
                continue;
            }
        }
    }

    Ok(())
}

struct Record {
    date: String,
    time: String,
    global_active_power: f32,
    global_reactive_power: f32,
    voltage: f32,
    global_intensity: f32,
    sub1: f32,
    sub2: f32,
    sub3: f32,
}

impl TryFrom<String> for Record {
    type Error = String;

    fn try_from(line: String) -> Result<Self, Self::Error> {
        let mut parts = line.split(";");
        (|| {
            Some(Record {
                date: parts.next()?.to_owned(),
                time: parts.next()?.to_owned(),
                global_active_power: parts.next()?.parse().ok()?,
                global_reactive_power: parts.next()?.parse().ok()?,
                voltage: parts.next()?.parse().ok()?,
                global_intensity: parts.next()?.parse().ok()?,
                sub1: parts.next()?.parse().ok()?,
                sub2: parts.next()?.parse().ok()?,
                sub3: parts.next()?.parse().ok()?,
            })
        })()
        .ok_or("Couldn't create record from provided string".to_owned())
    }
}

use clap::Parser;

/// Simple program to simulate sensor
#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct Args {
    /// Sensor identificator
    #[arg(long)]
    id: String,

    /// Gateway address
    #[arg(short, long)]
    gateway_addr: String,

    /// Path to the input file
    #[arg(
        short,
        long,
        default_value = "/home/aaras/dev/IOT/dataset/household_power_consumption.csv"
    )]
    input_file: String,

    /// Number of lines to skip
    #[arg(long, default_value_t = 547598)]
    skip: u32,

    /// Number of lines to use
    #[arg(long,  default_value_t = -1)]
    take: i64,

    /// Amount of time (in miliseconds) to wait between each request
    #[arg(long, default_value_t = 1000)]
    sleep: u64,
}
