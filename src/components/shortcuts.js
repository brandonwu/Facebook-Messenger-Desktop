/*
 * Slightly modified from Allen Guo's messenger-shortcuts; GPLv2 licensed
 * Source: https://github.com/guoguo12/messenger-shortcuts
 */

HELP_HTML = "List of shortcuts:\
<br><br>\
<b>Ctrl+N</b> &ndash; Compose [n]ew message<br>\
<b>Ctrl+L</b> &ndash; Search conversation [l]ist<br>\
<b>Ctrl+<i>n</i></b> &ndash; Jump to conversation <i>n</i>-th from top<br>\
<b>Ctrl+Up</b>/<b>Ctrl+Down</b> &ndash; Jump to conversation one above/below<br><br>\
<b>Ctrl+Tab</b>/<b>Ctrl+Shift+Tab</b> &ndash; Jump to conversation one above/below<br><br>\
<b>Ctrl+I</b> &ndash; Toggle conversation [i]nfo<br>\
<b>Ctrl+M</b> &ndash; [M]ute conversation<br><br>\
<b>Ctrl+/</b> &ndash; Display this help dialog<br>\
"

/** Helper functions **/

function getByAttr(doc, tag, attr, value) {
  return doc.querySelector(tag + '[' + attr + '="' + value + '"]');
}

function last(arr) {
  return arr.length === 0 ? undefined : arr[arr.length - 1];
}


/** Functionality **/

function jumpToMessage(doc, index) {
  doc.querySelectorAll('div[aria-label="Conversations"] a')[index].click();
}

function verticalJump(doc, isUp) {
  console.log('hello');
  var conversations = doc.querySelectorAll('[aria-label="Conversation List"] li');
  console.log(conversations);
  for (var i = 0; i < conversations.length; i++) {
    console.log("jump "+i);
    if (conversations[i].getAttribute('aria-relevant')) {
      jumpToMessage(doc, i + (isUp ? -1 : 1));
      return;
    }
  }
}

function selectFirstSearchResult(doc) {
  var first = doc.querySelector('span[role="search"] a');
  if (first) {
    first.click();
    // focus message input afterwards in case the user already has that chat open
    focusMessageInput(doc);
  }
}

function compose(doc) {
  getByAttr(doc, 'a', 'title', 'New Message').click();
}

function toggleInfo(doc) {
  getByAttr(doc, 'a', 'title', 'Conversation Information').click();
}

function mute(doc) {
  getByAttr(doc, 'input', 'type', 'checkbox').click();
}

function getSearchBar(doc) {
  return getByAttr(doc, 'input', 'placeholder', 'Search for people and groups');
}

function focusSearchBar(doc) {
  getSearchBar(doc).focus();
}

function focusMessageInput(doc) {
  doc.querySelector('div[role="main"] div[role="textbox"]').click();
}

function openDeleteDialog(doc) {
  last(doc.querySelectorAll('div.contentAfter div[aria-label="Conversation actions"]')).click();
  doc.querySelector('a[role="menuitem"] span span').click();
}

function openHelp(doc) {
  mute(doc);
  setTimeout(function() {
    doc.querySelector('div[role="dialog"] h2').innerHTML = "Keyboard Shortcuts for Messenger";
    doc.querySelector('div[role="dialog"] h2~div').innerHTML = HELP_HTML;
    doc.querySelector('div[role="dialog"] h2~div~div').remove();
  }, 100);
}

module.exports = {
  inject: function(doc) {
    doc.body.onkeydown = function(event) {
      // Escape key
      if (event.keyCode === 27) {
        focusMessageInput(doc);
      }

      if (event.keyCode == 13 && doc.activeElement === getSearchBar(doc)) {
        // we're going to change the input, so throw away this keypress
        event.preventDefault();
        selectFirstSearchResult(doc);
        return;
      }

      // Only combinations of the form Ctrl+<key> are accepted
      if (!(event.ctrlKey)) {
        return;
      }

      // Number keys
      if (event.keyCode >= 49 && event.keyCode <= 57) {
        jumpToMessage(doc, event.keyCode - 49);
      }

      // Other keys
      switch (event.keyCode) {
          case 78:  // N
              compose(doc);
          break;
          case 73:  // I
            toggleInfo(doc);
          break;
          case 77:  // M
              mute(doc);
          break;
          case 76:  // L
              focusSearchBar();
          break;
          case 9: // tab
              if (event.shiftKey) { // ctrl+shift+tab
                verticalJump(doc, true);
              } else {
                verticalJump(doc, false);
              }
          break;
          case 38: // up arrow
              verticalJump(doc, true);
          break;
          case 40: // down arrow
              verticalJump(doc, false);
          break;
          case 191: // Fwd. slash
              openHelp(doc);
          break;
          // default:
          //   focusMessageInput(doc);
      }
    }
  }
}
