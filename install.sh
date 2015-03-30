#!/bin/bash

sudo cp sounds/* /System/Library/Sounds

launchconfig=net.neilk.standschedule.plist
cp $launchconfig ~/Library/LaunchAgents 
launchctl unload $launchconfig
launchctl load -w $launchconfig
