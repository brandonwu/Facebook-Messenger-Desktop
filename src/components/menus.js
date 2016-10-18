var gui = window.require('nw.gui');
var clipboard = gui.Clipboard.get();
var AutoLaunch = require('auto-launch');
var windowBehaviour = require('./window-behaviour');
var dispatcher = require('./dispatcher');
var platform = require('./platform');
var settings = require('./settings');
var updater = require('./updater');
var blockSeen = require('./block-seen');
var utils = require('./utils');

module.exports = {
  /**
   * The main settings items. Their placement differs for each platform:
   * - on OS X they're in the top menu bar
   * - on Windows and linux they're in the tray icon's menu
   * - on all 3 platform, they're also in the right-click context menu
   */
  settingsItems: function(win, keep) {
    var self = this;
    return [{
      label: 'Reload',
      click: function() {
        windowBehaviour.saveWindowState(win);
        win.reload();
      }
    }, {
      type: 'separator'
    }, {
      label: 'Messenger',
      submenu: this.createFacebookMenu()
    }, {
      label: 'Application',
      submenu: this.createApplicationMenu()
    }, {
      label: 'Network',
      submenu: this.createNetworkMenu()
    }, /*{
      label: 'Update',
      submenu: this.createUpdateMenu(keep)
    },*/ {
      label: 'Theme',
      submenu: this.createThemesMenu(keep)
    },/*{
      type: 'separator'
    }, {
      type: 'checkbox',
      label: 'Run as Menu Bar App',
      setting: 'asMenuBarAppOSX',
      platforms: ['osx'],
      click: function() {
        settings.asMenuBarAppOSX = this.checked;
        win.setShowInTaskbar(!this.checked);

        if (this.checked) {
          self.loadTrayIcon(win);
        } else if (win.tray) {
          win.tray.remove();
          win.tray = null;
        }
      }
    },*//* {
      label: 'Check for Update',
      click: function() {
        updater.check(gui.App.manifest, function(error, newVersionExists, newManifest) {
          if (error || newVersionExists) {
            updater.prompt(win, false, error, newVersionExists, newManifest);
          } else {
            dispatcher.trigger('win.alert', {
              win: win,
              message: 'You’re using the latest version: ' + gui.App.manifest.version
            });
          }
        }, settings.updateToBeta);
      }
    }, *//*{
      label: 'Launch Dev Tools',
      click: function() {
        win.showDevTools();
      }
    }*/].map(function(item) {
      // If the item has a 'setting' property, use some predefined values
      if (item.setting) {
        if (!item.hasOwnProperty('checked')) {
          item.checked = settings[item.setting];
        }

        if (!item.hasOwnProperty('click')) {
          item.click = function() {
            settings[item.setting] = !item.checked;
          };
        }
      }

      return item;
    }).filter(function(item) {
      // Remove the item if the current platform is not supported
      return !Array.isArray(item.platforms) || (item.platforms.indexOf(platform.type) != -1);
    }).map(function(item) {
      var menuItem = new gui.MenuItem(item);
      menuItem.setting = item.setting;
      return menuItem;
    });
  },

  /**
   * Create the themes submenu shown in the main one.
   *
   * @param keep If true, then the menu will only be created once and it
   *             should listen for changes in the settings to update itself.
   */
  createThemesMenu: function(keep) {
    var menu = new gui.Menu();
    var THEMES = {
      'default': 'No Theme',
      'mosaic': 'Mosaic',
      'dark': 'Dark',
      'midnight': 'Midnight',
    };

    Object.keys(THEMES).forEach(function(key) {
      menu.append(new gui.MenuItem({
        type: 'checkbox',
        label: THEMES[key],
        checked: settings.theme == key,
        click: function() {
          if (keep) {
            menu.items.forEach(function(item) {
              item.checked = false;
            });

            this.checked = true;
          }

          settings.theme = key;
        }
      }));
    });

    if (keep) {
      settings.watch('theme', function(key) {
        menu.items.forEach(function(item) {
          item.checked = item.label == THEMES[key];
        });
      });
    }

    return menu;
  },

  createUpdatePreferenceMenu: function(keep) {
    var menu = new gui.Menu();
    var OPTIONS = {
      'stable': 'Stable',
      'beta': 'Beta'
    };

    Object.keys(OPTIONS).forEach(function(key) {
      menu.append(new gui.MenuItem({
        type: 'checkbox',
        label: OPTIONS[key],
        checked: (settings.updateToBeta && key == 'beta') || (!settings.updateToBeta && key == 'stable'),
        click: function() {
          if (keep) {
            menu.items.forEach(function(item) {
              item.checked = false;
            });

            this.checked = true;
          }

          if(key == 'beta')
            settings.updateToBeta = true;
          else
            settings.updateToBeta = false;
        }
      }));
    });

    if (keep) {
      settings.watch('updateToBeta', function(key) {
        menu.items.forEach(function(item) {
          item.checked = item.label == OPTIONS[key];
        });
      });
    }

    return menu;
  },

  createNetworkMenu: function(keep) {
    var menu = new gui.Menu();
    menu.append(new gui.MenuItem({
      type: 'checkbox',
      label: 'Use Proxy to Connect',
      setting: 'useProxy',
      checked: settings.useProxy,
      click: function() {
        settings.useProxy = this.checked;
        if (settings.useProxy) {
          gui.App.setProxyConfig(settings.proxyString);
        } else {
          gui.App.setProxyConfig("");
        }
      }
    }));

    menu.append(new gui.MenuItem({
      type: 'normal',
      label: 'Configure Proxy',
      setting: 'proxyString',
      click: function() {
        promptString = 'Enter the proxy string.\n\n' +
                       'Examples:\n' +
                       '   example.com:8888 - HTTP proxy\n' +
                       '   socks4://example.com:8888 - SOCKS4 proxy\n' +
                       '   socks5://example.com:8888 - SOCKS5 proxy';

        var proxy = window.prompt(promptString, settings.proxyString);

        if (proxy) {
          settings.proxyString = proxy;
        }

        if (settings.useProxy) {
          gui.App.setProxyConfig(settings.proxyString);
        } else {
          gui.App.setProxyConfig("");
        }
      }
    }));

    return menu;
  },

  /**
   * Create the facebook settings menu
   */
  createFacebookMenu: function() {
    var menu = new gui.Menu();
    menu.append(new gui.MenuItem({
      type: 'checkbox',
      label: 'Block seen/typing indicators',
      setting: 'blockSeen',
      checked: settings.blockSeen,
      click: function() {
        settings.blockSeen = this.checked;
        blockSeen.set(this.checked);
      }
    }));

    return menu;
  },

  /**
   * Create the application settings menu
   */
  createApplicationMenu: function() {
    var menu = new gui.Menu();

    menu.append(new gui.MenuItem({
      type: 'checkbox',
      label: 'Open Links in the Browser',
      setting: 'openLinksInBrowser',
      checked: settings.openLinksInBrowser,
      click: function() {
        settings.openLinksInBrowser = this.checked;
        windowBehaviour.setNewWinPolicy(win);
      }
    }));

    menu.append(new gui.MenuItem({
      type: 'checkbox',
      label: 'Launch on Startup',
      setting: 'launchOnStartup',
      checked: settings.launchOnStartup,
      click: function() {
        settings.launchOnStartup = this.checked;

        var launcher = new AutoLaunch({
          name: 'Messenger',
        });

        launcher.isEnabled(function(enabled) {
          if (settings.launchOnStartup && !enabled) {
            launcher.enable(function(error) {
              if (error) {
                console.error(error);
              }
            });
          }

          if (!settings.launchOnStartup && enabled) {
            launcher.disable(function(error) {
              if (error) {
                console.error(error);
              }
            });
          }
        });
      }
    }));

    menu.append(new gui.MenuItem({
      type: 'checkbox',
      label: 'Start minimized',
      setting: 'startMinimized',
      checked: settings.startMinimized,
      click: function() {
        settings.startMinimized = this.checked;
      }
    }));

    menu.append(new gui.MenuItem({
      type: 'checkbox',
      label: 'Close with ESC key',
      setting: 'closeWithEscKey',
      checked: settings.closeWithEscKey,
      click: function() {
        settings.closeWithEscKey = this.checked;
      }
    }));

    return menu;
  },

  createUpdateMenu: function(keep) {
    var menu = new gui.Menu();

    menu.append(new gui.MenuItem({
      type: 'checkbox',
      label: 'Check for Update on Launch',
      setting: 'checkUpdateOnLaunch',
      checked: settings.checkUpdateOnLaunch,
      click: function() {
        settings.checkUpdateOnLaunch = this.checked;
      }
    }));

    menu.append(new gui.MenuItem({
      label: 'Preference',
      submenu: this.createUpdatePreferenceMenu(keep)
    }));

    return menu;
  },

  createVisualMenu: function(keep) {
    var menu = new gui.Menu();

    menu.append(new gui.MenuItem({
      type: 'checkbox',
      label: 'Auto-Hide Sidebar',
      setting: 'autoHideSidebar',
      checked: settings.autoHideSidebar,
      click: function() {
        settings.autoHideSidebar = this.checked;
      }
    }));

    menu.append(new gui.MenuItem({
      label: 'Theme',
      submenu: this.createThemesMenu(keep)
    }));

    return menu;
  },

  /**
   * Create the menu bar for the given window, only on OS X.
   */
  loadMenuBar: function(win) {
    if (!platform.isOSX) {
      return;
    }

    var menu = new gui.Menu({
      type: 'menubar'
    });

    menu.createMacBuiltin('Messenger');
    var submenu = menu.items[0].submenu;

    submenu.insert(new gui.MenuItem({
      type: 'separator'
    }), 1);

    // Add the main settings
    this.settingsItems(win, true).forEach(function(item, index) {
      submenu.insert(item, index + 2);
    });

    // Watch the items that have a 'setting' property
    submenu.items.forEach(function(item) {
      if (item.setting) {
        settings.watch(item.setting, function(value) {
          item.checked = value;
        });
      }
    });

    win.menu = menu;
  },

  /**
   * Create the menu for the tray icon.
   */
  createTrayMenu: function(win) {
    var menu = new gui.Menu();

    // Add the main settings
    this.settingsItems(win, true).forEach(function(item) {
      menu.append(item);
    });

    menu.append(new gui.MenuItem({
      type: 'separator'
    }));

    menu.append(new gui.MenuItem({
      label: 'Show Messenger',
      click: function() {
        win.show();
      }
    }));

    menu.append(new gui.MenuItem({
      label: 'Quit Messenger',
      click: function() {
		dispatcher.trigger('close', true);
      }
    }));

    // Watch the items that have a 'setting' property
    menu.items.forEach(function(item) {
      if (item.setting) {
        settings.watch(item.setting, function(value) {
          item.checked = value;
        });
      }
    });

    return menu;
  },

  /**
   * Create the tray icon.
   */
  loadTrayIcon: function(win) {
    if (win.tray) {
      win.tray.remove();
      win.tray = null;
    }

    var tray = new gui.Tray({
      icon: 'images/icon_' + (platform.isOSX ? 'menubar.tiff' : 'tray.png')
    });

    tray.on('click', function() {
      win.show();
    });

    tray.tooltip = 'Messenger for Desktop';
    tray.menu = this.createTrayMenu(win);

    // keep the object in memory
    win.tray = tray;
  },

  /**
   * Create a context menu for the window and document.
   */
  createContextMenu: function(win, window, document, targetElement) {
    var menu = new gui.Menu();

  if (targetElement.tagName.toLowerCase() == 'a') {
      menu.append(new gui.MenuItem({
        label: "Copy Link",
        click: function() {
          var url = utils.skipFacebookRedirect(targetElement.href);
          clipboard.set(url);
        }
      }));
    } else if (targetElement.classList[0] == "_3xn1") {
      menu.append(new gui.MenuItem({
        label: "Copy Link",
        click: function() {
          var url = utils.skipFacebookRedirect(targetElement.parentNode.parentNode.href);
          clipboard.set(url);
        }
      }));
    } else if (targetElement.classList[0] == "__6m") {
      menu.append(new gui.MenuItem({
        label: "Copy Link",
        click: function() {
          var url = utils.skipFacebookRedirect(targetElement.parentNode.parentNode.parentNode.parentNode.href);
          clipboard.set(url);
        }
      }));
    } else if (targetElement.classList[0] == "_4ik4") {
      menu.append(new gui.MenuItem({
        label: "Copy Link",
        click: function() {
          var url = utils.skipFacebookRedirect(targetElement.parentNode.parentNode.parentNode.parentNode.parentNode.href);
          clipboard.set(url);
        }
      }));
    } else {
      //window.alert(targetElement.classList);
      var selection = document.getSelection().toString();
      if (selection.length > 0) {
        menu.append(new gui.MenuItem({
          label: "Copy",
          click: function() {
            clipboard.set(selection);
          }
        }));
      } else {
        this.settingsItems(win, false).forEach(function(item) {
          menu.append(item);
        });
      }
    }
    return menu;
  },

  /**
   * Listen for right clicks and show a context menu.
   */
  injectContextMenu: function(win, document) {
    document.body.addEventListener('contextmenu', function(event) {
	  var x = event.x, y = event.y;
	  if(!utils.areSameContext(this, win)) {
		  // When we are not in the same context
		  // The window is relative to screen position.
		  // This is due to the hidden background page that exists at (0, 0).

		  // Fixes #412
		  x += win.x;
		  y += win.y;
	  }
      if (event.target.isContentEditable || event.target.tagName.toLowerCase() == "input") {
        return;
      } else {
        event.preventDefault();
        this.createContextMenu(win, window, document, event.target).popup(x, y);
      }
      // return false;
    }.bind(this));
  }
};
