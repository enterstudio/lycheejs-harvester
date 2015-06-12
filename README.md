
# Sorbet Static (0.8.6)

## Overview

Sorbet Static is a fork of the lycheeJS webserver Sorbet.
Its purpose is to have a full-blown HTTP 1.1 compliant
webserver that can easily be installed on any operating
system.

We think the NPM ecosystem is broken and we don't want
to download hundreds of megabytes of source code just
for a simple webserver, that's why we offer bundles here.

There's also a sorbet-portable variant available which
includes all required iojs binaries and can be run on
Linux, OSX and Windows - perfect for your USB stick :)


The upstream project can be found at [lycheeJS](https://github.com/LazerUnicorns/lycheeJS.git)


## Features

- Headless Webserver
- No additional requirements
- HTTP 1.1 compliant
- Multiplexed HTTP pipes
- Multiple Virtual Hosts
- Multiple Instances 
- Multiple Profiles
- Socket- and Event-based API


## Bundle Installation

Take a look at the releases here on github.
There are bundles available for multiple operating systems.


## Manual Installation

Clone this github repository. This repository also ships an example.

```bash
git clone https://github.com/LazerUnicorns/sorbet-static.git ./sorbet-static;

# Optional: Starting an example server
cd ./sorbet-static;
./example/start.sh;
```


## Usage

Sorbet will create a `sorbet.log` and `sorbet.err` file
in the current working directory. These files reflect
occuring log messages and errors.


## License

lycheeJS is (c) 2012-2015 LazerUnicorns and released under MIT license.
Sorbet-Static is (c) 2012-2015 LazerUnicorns and released under WTFPL license.
The runtimes are owned and copyrighted by their respective owners.

Take a look at the [LICENSE.txt](LICENSE.txt) file.

