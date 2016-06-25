#!/bin/bash

LYCHEEJS_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../../../"; pwd);
PROJECT_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../"; pwd);



if [ -d $PROJECT_ROOT/build ]; then

	cd $PROJECT_ROOT;

	fakeroot -- ./bin/package-ubuntu.sh arm armhf;
	fakeroot -- ./bin/package-ubuntu.sh x86 x86;
	fakeroot -- ./bin/package-ubuntu.sh x86_64 amd64;


	# TODO: Packaging for OSX and Windows


	# git commit -m ":construction: lychee.js fertilizer package :construction:";

	echo "SUCCESS";
	exit 0;

else

	echo "FAILURE";
	exit 1;

fi;
