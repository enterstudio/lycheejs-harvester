#!/usr/bin/env bash

BUNDLE_ROOT=$(cd "$(dirname "$0")"; pwd);
DIST_ROOT="$BUNDLE_ROOT/dist";

rm -rf $DIST_ROOT/*;

