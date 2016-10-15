# Messenger for Desktop

Bring [messenger.com](https://messenger.com) to your OS X, Windows or Linux desktop. Built with [NW.js 14.5](http://nwjs.io/). Not affiliated with Facebook.

![Cross-platform screenshot](screenshot.png)

## Features Supported (official)

* Sounds *(can be disabled in settings)*
* Desktop notifications *(enable them in settings)*
* Voice and video calls

## Extras (configurable)

* Themes
* Keyboard shortcuts for nearly everything - press `Ctrl+/` to see the full list
* System tray icon
* Start with OS
* Desktop notification support
* Proxy support
* Open links in your default browser or a new window
* Don't send read receipts/typing notifications
* Frameless look with integrated window controls
* (in progress) Inline image expansion - hover or click on image links to open them quickly in Messenger

## Build

### Pre-requisites

    # install gulp
    npm install -g gulp

    # install dependencies
    npm install

* **wine**: If you're on OS X/Linux and want to build for Windows, you need [Wine](http://winehq.org/) installed. Wine is required in order
to set the correct icon for the exe. If you don't have Wine, you can comment out the `winIco` field in `gulpfile`.
* **makensis**: Required by the `pack:win32` task in `gulpfile` to create the Windows installer.
* [**fpm**](https://github.com/jordansissel/fpm): Required by the `pack:linux{32|64}:{deb|rpm}` tasks in `gulpfile` to create the linux installers.

Quick install on OS X:

    brew install wine makensis
    sudo gem install fpm

### OS X: pack the app in a .dmg

    gulp pack:osx64

### Windows: create the installer

    gulp pack:win32

### Linux 32/64-bit: pack the app in a .deb or .rpm

    gulp pack:linux{32|64}:{deb|rpm}

The output is in `./dist`. Take a look in `gulpfile.coffee` for additional tasks.

**TIP**: use `gulp build:win32 --noicon` to quickly build the Windows app without the icon.

**TIP**: for OS X, use the `run:osx64` task to build the app and run it immediately.

**TIP**: to be able to play MP3 and H264, you need to replace the ffmpeg lib in NWJS with the one provided in this repository: https://github.com/iteufel/nwjs-ffmpeg-prebuilt/. The best way is to copy-paste it in the corresponding NWJS package (located in the cache) before building the software.

## Debugging

With the move to nw.js 0.14.x, Messenger for Desktop now runs as a Chrome Extension. Node and WebKit run in two different contexts. When debugging
with DevTools, files that are `required()`'d will not be visible when running normally.

In order to access devtools, you must be running with the `sdk` flavor of nwjs. Simply change the flavor in the nw-builder section of the gulpfile from `'normal'` to `'sdk'` and rebuild. Then, to find the devtools, right click on the window buttons in the top right to find `Inspect` and `Inspect background page`. If you would like to actually be able to right click elements and inspect them, comment out the custom context menu injection in `app.js`.

## Contributions

All contributions are welcome! For feature requests and bug reports please [submit an issue](https://github.com/brandonwu/Facebook-Messenger-Desktop/issues).

## License

The MIT License (MIT)

Copyright (c) 2016 Alexandru Rosianu (Original developer) & Emile Fugulin (Maintainer)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
