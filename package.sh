#!/usr/bin/env bash

set -u;
set -e;

RELEASE=$(date --utc +%FT)"00:00:00Z";
VERSION="0.8.6";


BUNDLE_ROOT=$(cd "$(dirname "$0")"; pwd);
DIST_ROOT="$BUNDLE_ROOT/dist";


rm -rf $DIST_ROOT/*;

if [ ! -d "$DIST_ROOT" ]; then
	mkdir "$DIST_ROOT";
fi;


if [ ! -f "$BUNDLE_ROOT/lychee/build/iojs/core.js" ]; then

	cd $BUNDLE_ROOT;
	$(./bin/sorbet.sh);

fi;



#
#
# 1. Create Ubuntu Packages (.deb files)
#
#

if [ ! -f "$DIST_ROOT/sorbet-$VERSION-ubuntu_amd64.deb" ]; then

	cd $BUNDLE_ROOT;

	if [ -d "$DIST_ROOT/ubuntu" ]; then
		rm -rf "$DIST_ROOT/ubuntu";
	fi;

	rsync -a ./package/ubuntu/ "$DIST_ROOT/ubuntu/";
	mkdir -p "$DIST_ROOT/ubuntu/root/usr/share/sorbet/bin";
	mkdir -p "$DIST_ROOT/ubuntu/root/usr/share/sorbet/lychee";
	mkdir -p "$DIST_ROOT/ubuntu/root/usr/share/sorbet/sorbet";
	rsync -a ./bin/ "$DIST_ROOT/ubuntu/root/usr/share/sorbet/bin/" --delete;
	rsync -a ./lychee/ "$DIST_ROOT/ubuntu/root/usr/share/sorbet/lychee/" --delete;
	rsync -a ./sorbet/ "$DIST_ROOT/ubuntu/root/usr/share/sorbet/sorbet/" --delete;

	rm "$DIST_ROOT/ubuntu/root/usr/share/sorbet/bin/sorbet.sh";
	rm -rf "$DIST_ROOT/ubuntu/root/usr/share/sorbet/bin/runtime/iojs/linux/arm";
	rm -rf "$DIST_ROOT/ubuntu/root/usr/share/sorbet/bin/runtime/iojs/linux/x86";
	rm -rf "$DIST_ROOT/ubuntu/root/usr/share/sorbet/bin/runtime/iojs/osx";
	rm -rf "$DIST_ROOT/ubuntu/root/usr/share/sorbet/bin/runtime/iojs/windows";

	if [ -f "$DIST_ROOT/ubuntu/root/usr/share/sorbet/sorbet/.pid" ]; then
		rm "$DIST_ROOT/ubuntu/root/usr/share/sorbet/sorbet/.pid";
	fi;


	find "$DIST_ROOT/ubuntu/" -type d -exec chmod 0755 {} \;
	find "$DIST_ROOT/ubuntu/" -type f -exec chmod go-w {} \;
	chown -R root:root "$DIST_ROOT/ubuntu/";


	cd $DIST_ROOT/ubuntu/root;
	tar czf $DIST_ROOT/ubuntu/data.tar.gz *;


	cd $DIST_ROOT/ubuntu/DEBIAN;
	let SIZE=`du -s $DIST_ROOT/ubuntu/root | sed s'/\s\+.*//'`+8
	sed s"/__ARCH__/amd64/" -i ./control;
	sed s"/__SIZE__/${SIZE}/" -i ./control;
	sed s"/__VERSION__/${VERSION}/" -i ./control;
	tar czf "$DIST_ROOT/ubuntu/control.tar.gz" *;


	cd $DIST_ROOT/ubuntu;
	echo 2.0 > ./debian-binary;
	find $DIST_ROOT/ubuntu/ -type d -exec chmod 0755 {} \;
	find $DIST_ROOT/ubuntu/ -type f -exec chmod go-w {} \;
	chown -R root:root $DIST_ROOT/ubuntu/;
	ar r "$DIST_ROOT/sorbet-$VERSION-ubuntu_amd64.deb" debian-binary control.tar.gz data.tar.gz;


	rm -rf "$DIST_ROOT/ubuntu";

fi;


if [ ! -f "$DIST_ROOT/sorbet-$VERSION-ubuntu_armhf.deb" ]; then

	cd $BUNDLE_ROOT;

	if [ -d "$DIST_ROOT/ubuntu" ]; then
		rm -rf "$DIST_ROOT/ubuntu";
	fi;

	rsync -a ./package/ubuntu/ "$DIST_ROOT/ubuntu/";
	mkdir -p "$DIST_ROOT/ubuntu/root/usr/share/sorbet/bin";
	mkdir -p "$DIST_ROOT/ubuntu/root/usr/share/sorbet/lychee";
	mkdir -p "$DIST_ROOT/ubuntu/root/usr/share/sorbet/sorbet";
	rsync -a ./bin/ "$DIST_ROOT/ubuntu/root/usr/share/sorbet/bin/" --delete;
	rsync -a ./lychee/ "$DIST_ROOT/ubuntu/root/usr/share/sorbet/lychee/" --delete;
	rsync -a ./sorbet/ "$DIST_ROOT/ubuntu/root/usr/share/sorbet/sorbet/" --delete;

	rm "$DIST_ROOT/ubuntu/root/usr/share/sorbet/bin/sorbet.sh";
	rm -rf "$DIST_ROOT/ubuntu/root/usr/share/sorbet/bin/runtime/iojs/linux/x86";
	rm -rf "$DIST_ROOT/ubuntu/root/usr/share/sorbet/bin/runtime/iojs/linux/x86_64";
	rm -rf "$DIST_ROOT/ubuntu/root/usr/share/sorbet/bin/runtime/iojs/osx";
	rm -rf "$DIST_ROOT/ubuntu/root/usr/share/sorbet/bin/runtime/iojs/windows";

	if [ -f "$DIST_ROOT/ubuntu/root/usr/share/sorbet/sorbet/.pid" ]; then
		rm "$DIST_ROOT/ubuntu/root/usr/share/sorbet/sorbet/.pid";
	fi;


	find "$DIST_ROOT/ubuntu/" -type d -exec chmod 0755 {} \;
	find "$DIST_ROOT/ubuntu/" -type f -exec chmod go-w {} \;
	chown -R root:root "$DIST_ROOT/ubuntu/";


	cd $DIST_ROOT/ubuntu/root;
	tar czf $DIST_ROOT/ubuntu/data.tar.gz *;


	cd $DIST_ROOT/ubuntu/DEBIAN;
	let SIZE=`du -s $DIST_ROOT/ubuntu/root | sed s'/\s\+.*//'`+8
	sed s"/__ARCH__/armhf/" -i ./control;
	sed s"/__SIZE__/${SIZE}/" -i ./control;
	sed s"/__VERSION__/${VERSION}/" -i ./control;
	tar czf "$DIST_ROOT/ubuntu/control.tar.gz" *;


	cd $DIST_ROOT/ubuntu;
	echo 2.0 > ./debian-binary;
	find $DIST_ROOT/ubuntu/ -type d -exec chmod 0755 {} \;
	find $DIST_ROOT/ubuntu/ -type f -exec chmod go-w {} \;
	chown -R root:root $DIST_ROOT/ubuntu/;
	ar r "$DIST_ROOT/sorbet-$VERSION-ubuntu_armhf.deb" debian-binary control.tar.gz data.tar.gz;


	rm -rf "$DIST_ROOT/ubuntu";

fi;


if [ ! -f "$DIST_ROOT/sorbet-$VERSION-ubuntu_i386.deb" ]; then

	cd $BUNDLE_ROOT;

	if [ -d "$DIST_ROOT/ubuntu" ]; then
		rm -rf "$DIST_ROOT/ubuntu";
	fi;

	rsync -a ./package/ubuntu/ "$DIST_ROOT/ubuntu/";
	mkdir -p "$DIST_ROOT/ubuntu/root/usr/share/sorbet/bin";
	mkdir -p "$DIST_ROOT/ubuntu/root/usr/share/sorbet/lychee";
	mkdir -p "$DIST_ROOT/ubuntu/root/usr/share/sorbet/sorbet";
	rsync -a ./bin/ "$DIST_ROOT/ubuntu/root/usr/share/sorbet/bin/" --delete;
	rsync -a ./lychee/ "$DIST_ROOT/ubuntu/root/usr/share/sorbet/lychee/" --delete;
	rsync -a ./sorbet/ "$DIST_ROOT/ubuntu/root/usr/share/sorbet/sorbet/" --delete;

	rm "$DIST_ROOT/ubuntu/root/usr/share/sorbet/bin/sorbet.sh";
	rm -rf "$DIST_ROOT/ubuntu/root/usr/share/sorbet/bin/runtime/iojs/linux/arm";
	rm -rf "$DIST_ROOT/ubuntu/root/usr/share/sorbet/bin/runtime/iojs/linux/x86_64";
	rm -rf "$DIST_ROOT/ubuntu/root/usr/share/sorbet/bin/runtime/iojs/osx";
	rm -rf "$DIST_ROOT/ubuntu/root/usr/share/sorbet/bin/runtime/iojs/windows";

	if [ -f "$DIST_ROOT/ubuntu/root/usr/share/sorbet/sorbet/.pid" ]; then
		rm "$DIST_ROOT/ubuntu/root/usr/share/sorbet/sorbet/.pid";
	fi;


	find "$DIST_ROOT/ubuntu/" -type d -exec chmod 0755 {} \;
	find "$DIST_ROOT/ubuntu/" -type f -exec chmod go-w {} \;
	chown -R root:root "$DIST_ROOT/ubuntu/";


	cd $DIST_ROOT/ubuntu/root;
	tar czf $DIST_ROOT/ubuntu/data.tar.gz *;


	cd $DIST_ROOT/ubuntu/DEBIAN;
	let SIZE=`du -s $DIST_ROOT/ubuntu/root | sed s'/\s\+.*//'`+8
	sed s"/__ARCH__/i386/" -i ./control;
	sed s"/__SIZE__/${SIZE}/" -i ./control;
	sed s"/__VERSION__/${VERSION}/" -i ./control;
	tar czf "$DIST_ROOT/ubuntu/control.tar.gz" *;


	cd $DIST_ROOT/ubuntu;
	echo 2.0 > ./debian-binary;
	find $DIST_ROOT/ubuntu/ -type d -exec chmod 0755 {} \;
	find $DIST_ROOT/ubuntu/ -type f -exec chmod go-w {} \;
	chown -R root:root $DIST_ROOT/ubuntu/;
	ar r "$DIST_ROOT/sorbet-$VERSION-ubuntu_i386.deb" debian-binary control.tar.gz data.tar.gz;


	rm -rf "$DIST_ROOT/ubuntu";

fi;


exit 0;

