#!/bin/bash

LYCHEEJS_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../../../"; pwd);
PROJECT_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../"; pwd);
PROJECT_VERSION=$(cd $PROJECT_ROOT && cat ./build/node/main/core.js | grep VERSION | cut -d\" -f 2 | cut -d$'\n' -f 1);
LYCHEEJS_HELPER=`which lycheejs-helper`;


build_arch="$1";
package_arch="$2";
build="$PROJECT_ROOT/build/node/main-linux/$build_arch";
package="$PROJECT_ROOT/build/node/main-ubuntu/$package_arch";
template="$PROJECT_ROOT/bin/package/ubuntu";


cd $PROJECT_ROOT;

if [ -d $(dirname "$package") ]; then
	rm -rf $(dirname "$package");
fi;

mkdir -p $(dirname "$package");
cp -R $template $package;

cp "$build/core.js"  "$package/root/usr/lib/lycheejs-harvester/core.js";
cp "$build/index.js" "$package/root/usr/lib/lycheejs-harvester/index.js";
cp "$build/node"     "$package/root/usr/lib/lycheejs-harvester/node";

let package_size=`du -s $package/root | sed s'/\s\+.*//'`+8;

find "$package/" -type d -exec chmod 0755 {} \;
find "$package/" -type f -exec chmod go-w {} \;
chown -R root:root "$package/";

cd "$package/root";
tar czf "$package/data.tar.gz" *;
rm -rf "$package/root";

sed s"/__ARCH__/${package_arch}/"       -i "$package/DEBIAN/control";
sed s"/__SIZE__/${package_size}/"       -i "$package/DEBIAN/control";
sed s"/__VERSION__/${PROJECT_VERSION}/" -i "$package/DEBIAN/control";

chmod 0755 "$package/DEBIAN/postinst";
chmod 0755 "$package/DEBIAN/preinst";
chmod 0755 "$package/DEBIAN/prerm";

cd "$package/DEBIAN";
tar czf "$package/control.tar.gz" *;
rm -rf "$package/DEBIAN";

cd "$package";
echo 2.0 > "$package/debian-binary";
chown -R root:root "$package/";
ar r "${PROJECT_ROOT}/build/lycheejs-harvester-${PROJECT_VERSION}-ubuntu_${package_arch}.deb" debian-binary control.tar.gz data.tar.gz;


cd "$PROJECT_ROOT";
rm -rf "$package";

