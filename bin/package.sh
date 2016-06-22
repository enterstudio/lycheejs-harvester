#!/bin/bash

LYCHEEJS_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../../../"; pwd);
PROJECT_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../"; pwd);


if [ -d $PROJECT_ROOT/build ]; then

	# git commit -m ":construction: lychee.js fertilizer package :construction:";

	echo "SUCCESS";
	exit 0;

else

	echo "FAILURE";
	exit 1;

fi;
