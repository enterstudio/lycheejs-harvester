#!/bin/bash

LYCHEEJS_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../../../"; pwd);
PROJECT_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../"; pwd);
PROJECT_VERSION=$(cd $PROJECT_ROOT && cat ./build/node/main/core.js | grep VERSION | cut -d\" -f 2 | cut -d$'\n' -f 1);

TMP_STATUS="/tmp/lycheejs-harvester.json";
GITHUB_TOKEN=$(cat "/opt/lycheejs/.github/TOKEN");
RELEASE_USER="Artificial-Engineering";
RELEASE_REPO="lycheejs-harvester";
RELEASE_NAME=$(date +"%Y.%m.%d");
RUNTIME_ROOT=$(cd "$(dirname "$0")/../"; pwd);


if [ "$GITHUB_TOKEN" != "" ]; then

	cd $PROJECT_ROOT;

	curl --silent -X POST -H "Authorization: token $GITHUB_TOKEN" -H "Content-Type: application/json" --data "{\"tag_name\":\"$RELEASE_NAME\",\"name\":\"$RELEASE_NAME\",\"prerelease\":true}" "https://api.github.com/repos/$RELEASE_USER/$RELEASE_REPO/releases" -o "$TMP_STATUS";

	release_id=$(cat "$TMP_STATUS" | grep id | cut -d"," -f1 | cut -d":" -f2 | head -1 | tr -d '[[:space:]]');

	if [ "$release_id" != "\"ValidationFailed\"" ]; then

		cd $PROJECT_ROOT;

		echo "> uploading ubuntu amd64 for $release_id ...";
		curl --silent -X POST -H "Authorization: token $GITHUB_TOKEN" -H "Content-Type: application/vnd.debian.binary-package" --data-binary "@$PROJECT_ROOT/build/lycheejs-harvester-${PROJECT_VERSION}-ubuntu_amd64.deb" "https://uploads.github.com/repos/$RELEASE_USER/$RELEASE_REPO/releases/$release_id/assets?name=lycheejs-harvester-${PROJECT_VERSION}-ubuntu_amd64.deb" &> /dev/null;

		echo "> uploading ubuntu armhf for $release_id ...";
		curl --silent -X POST -H "Authorization: token $GITHUB_TOKEN" -H "Content-Type: application/vnd.debian.binary-package" --data-binary "@$PROJECT_ROOT/build/lycheejs-harvester-${PROJECT_VERSION}-ubuntu_armhf.deb" "https://uploads.github.com/repos/$RELEASE_USER/$RELEASE_REPO/releases/$release_id/assets?name=lycheejs-harvester-${PROJECT_VERSION}-ubuntu_armhf.deb" &> /dev/null;

		echo "> uploading ubuntu x86 for $release_id ...";
		curl --silent -X POST -H "Authorization: token $GITHUB_TOKEN" -H "Content-Type: application/vnd.debian.binary-package" --data-binary "@$PROJECT_ROOT/build/lycheejs-harvester-${PROJECT_VERSION}-ubuntu_x86.deb" "https://uploads.github.com/repos/$RELEASE_USER/$RELEASE_REPO/releases/$release_id/assets?name=lycheejs-harvester-${PROJECT_VERSION}-ubuntu_x86.deb" &> /dev/null;

		echo "SUCCESS";
		exit 0;

	else

		echo "FAILURE";
		exit 1;

	fi;

fi;

