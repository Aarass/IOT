use std::collections::HashMap;
use std::env;
use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;

fn main() -> std::io::Result<()> {
    let file = File::open(env::args().skip(1).next().unwrap())?;
    let reader = BufReader::new(file);

    let http_client = reqwest::blocking::Client::new();

    let fields = [
        "date",
        "time",
        "global_active_power",
        "global_reactive_power",
        "voltage",
        "global_intensity",
        "sub1",
        "sub2",
        "sub3",
    ];

    for maybe_line in reader.lines().skip(1).take(3) {
        if let Ok(line) = maybe_line {
            if line.contains('?') {
                continue;
            }

            let mut map = HashMap::new();
            let mut parts = line.split(";");

            for field in fields {
                if let Some(value) = parts.next() {
                    map.insert(field, value);
                } else {
                    dbg!("Unknown error");
                    continue;
                }
            }

            // let req = http_client.post("http://httpbin.org/post").json(&map);
            // req.send().unwrap();
        }
    }

    Ok(())
}
