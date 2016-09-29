#!/bin/bash

HARVESTER_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../"; pwd);
HARVESTER_PROFILE=$(realpath "$PWD/$2");


case "$1" in

	start)

		cd $HARVESTER_ROOT;
		lycheejs-helper env:node "$HARVESTER_ROOT/source/CLI.js" start "$HARVESTER_PROFILE";

	;;

	status)

		cd $HARVESTER_ROOT;
		lycheejs-helper env:node "$HARVESTER_ROOT/source/CLI.js" status;

	;;

	stop)

		cd $HARVESTER_ROOT;
		lycheejs-helper env:node "$HARVESTER_ROOT/source/CLI.js" stop;

	;;

	*)

		cd $HARVESTER_ROOT;
		lycheejs-helper env:node "$HARVESTER_ROOT/source/CLI.js" help;

	;;

esac;

