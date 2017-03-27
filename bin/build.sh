#!/bin/bash

if [ -z "$LYCHEEJS_ROOT" ]; then
	LYCHEEJS_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../../../"; pwd);
fi;


PROJECT_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../"; pwd);
LYCHEEJS_HELPER="$LYCHEEJS_ROOT/bin/helper.sh";


if [ -e "$LYCHEEJS_HELPER" ]; then

	cd $PROJECT_ROOT;
	"$LYCHEEJS_HELPER" env:node ./bin/build.js;

	echo "SUCCESS";
	exit 0;

else

	echo "FAILURE";
	exit 1;

fi;

