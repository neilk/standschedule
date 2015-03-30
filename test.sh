#!/bin/bash

sudo cp sounds/* /System/Library/Sounds

launchconfig='net.neilk.standschedule.test.plist'
cp $launchconfig ~/Library/LaunchAgents 
launchctl unload $launchconfig
launchctl load -w $launchconfig
