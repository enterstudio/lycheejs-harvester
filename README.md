
# lycheejs-harvester

## Overview

`lycheejs-harvester` is a fork of the upstream lychee.js Engine.

It is a portable, dead-simple and easy to use webserver.

It is using the `/libraries/harvester` library in order to
build up a webserver. The harvester is a peer-cloud synchronized
webserver that shares threats, improvements and updates among
other instances across the interwebz.

It is automatically built and deployed to GitHub using the following
`lycheejs-fertilizer` integration scripts:

- `bin/build.sh` builds the harvester
- `bin/package.sh` deploys everything to the `releases` section on GitHub.

The upstream project can be found in the [lychee.js Engine](https://github.com/Artificial-Engineering/lycheejs)
repository or on the [lychee.js Website](https://github.com/Artificial-Engineering/lycheejs-website.)
repository available at [https://lychee.js.org](https://lychee.js.org).



## Features

As the `lycheejs-harvester` is built with the lychee.js Engine,
the webserver can also be used on embedded and mobile devices.

Here's a quick feature list:

- Headless Webserver
- Portable Webserver
- Extendable Webserver (when used as a library)
- No additional requirements
- HTTP 1.1 compliant
- WS 13 compliant
- TCP fallback
- Multiplexed HTTP sockets
- Multipipelined HTTP sockets
- Multiple Instances
- Multiple Profiles
- On-the-fly Protocol Upgrades and Downgrades for NAT breaking
- Sandboxed Instances (debuggable with `lycheejs-ranger`)
- Serializable Instances (resumable on another device at a different time)
- Event-driven API
- Socket-driven API



## Bundle Installation

The [releases section](https://github.com/Artificial-University/lycheejs-harvester/releases)
offers pre-built bundles for multiple operating systems.



## Installation and Build Process

The build process is integrated with the `lycheejs-fertilizer` toolchain.
These are the steps to get everything to run and build properly:

Local development requires zero overhead, just start the `lycheejs-harvester`
and use the existing toolchain.

```bash
cd /opt/lycheejs;

# This will clone the harvester repository correctly
git clone --single-branch --branch master https://github.com/Artificial-University/lycheejs-harvester ./projects/lycheejs-harvester;

# This will build and deploy the harvester automatically
lycheejs-fertilizer node/main /projects/lycheejs-harvester;
```



## Usage

Use `cd /path/to/www` before to change the website folder.
Usage is pretty simple, the following commands are implemented:

- `lycheejs-harvester start <path/to/profile.json>`
- `lycheejs-harvester status`
- `lycheejs-harvester stop`



## Example

```bash
# This will serve the folder /var/www on localhost:8080

cd /var/www;

echo -e "<h1>It works!</h1>" > index.html;
echo -e "{ "host\":\"localhost\", \"port\":8080 }" > development.json;
echo -e "{ "host\":\"website.tld\", \"port\":80, \"sandbox\":true }" > production.json;

lycheejs-harvester start ./development.json;
```



## Profile

- `host` is a `String`. It is defaulted with `null`.
- `port` is a `Number`. It is defaulted with `8080`.
- `debug` is a `Boolean`. It is defaulted with `false`.
- `sandbox` is a `Boolean`. It is defaulted with `false`.


Example:

```json
{
	"host":    "website.tld",
	"port":    8080,
	"debug":   false,
	"sandbox": true
}
```



## License

lychee.js is (c) 2012-2016 Artificial-Engineering and released under MIT / Expat license.
The projects and demos are licensed under CC0 (public domain) license.
The runtimes are owned and copyrighted by their respective owners and may be shipped under a different license.

For further details take a look at the [LICENSE.txt](LICENSE.txt) file.

