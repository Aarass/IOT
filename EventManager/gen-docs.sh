#!/bin/bash

asyncapi generate fromTemplate ./asyncapi/asyncapi.yaml @asyncapi/html-template@3.0.0 --use-new-generator -p singleFile=true -o ./asyncapi/docs --force-write
