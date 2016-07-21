// $Header: svn+ssh://srcctl.devel.nandomedia.com/nm/devel/subversion/support/js-libs/tags/js-libs_1.3/MI_Commenting/js/MI_Commenting.js 38 2013-11-21 19:29:34Z jwhetzel $
/** MI_Commenting.js ***************************************************************
 * @fileOverview
 * A generic class for managing commenting functionality. This app should be
 * extended with an backend-specific extension.
 *
 * @minify true
 * @author Joe Whetzel (jwhetzel [at] mcclatchyinteractive.com)
 * @aggpath commenting/js/MI_Commenting.js
 */

/**
 * Commenting app constructor. This app functions as a generalized API for 
 * commenting functionality, a backend-specific extension is required.
 *
 * <p>All that is required to implement commenting on a page is:</p>
 * <ol>
 *   <li>A target div, default is to look for a div with an id of "commentingStage",</li>
 *   <li>Instantiate the commenting app, and</li>
 *   <li>Call the commenting app's display method.</li>
 * </ol>
 * <pre><div id='commentingStage'></div>
<script>
	mi.commenting = new mi.Commenting();
	mi.commenting.display();
</script></pre>
 *
 * <h3>Configuration options</h3>
 * <dl>
 *   <dt>accountName</dt>
 *   <dd>Name used by the backend to identify the site, default is derived from 
 *     the domain.</dd>
 *   <dt>enabled</dt>
 *   <dd>Integer value to enable/disable commenting, default is enabled.<br>
 *     0 = fully disabled<br>
 *     1 = fully enabled<br>
 *     2 = disable comment submission & display<br>
 *     3 = enable comment submission & display only<br>
 *     4 = disable popular threads widget<br>
 *   </dd>
 *   <dt>target</dt>
 *   <dd>Id value of the target element on the page in which the commenting 
 *     features are inserted, default is "commentingStage".</dd>
 * </dl>
 *
 * @constructor
 */
mi.Commenting = function() {
  mi.App.apply(this, arguments);
/**
 * @private
 */
   this._manageConf = function(prop, val) {
    switch (prop) {
      case 'enabled':
        var v = parseInt(val);
        if (isNaN(v)) {
					val = (val.toLowerCase) ? val.toLowerCase() : val;
        	switch (val) {
						case true:
						case 'true':
						case 'yes':
						case 'on':
							v = 1;
							break;
						default:
							v = 0;
							break;
        	}
        }
        val = v;
			default:
				break;
    }
    return val;
  };
  // without the ability to disable commenting globally commenting will default to disabled
  if (mi.control && mi.control.commenting != undefined) {
		this.setConf('enabled',mi.control.commenting);
  } else {
  	this.setConf('enabled',0);
  	console.warn('Commenting has been instantiated, but disabled because mi.control.commenting is not defined.');
  }
  mi.loadPageInfo();
  // account name is based on the domain, i.e. for www.mireference.com the account name is "mireference"
  var splitHost = window.location.host.split('.');
	this.setConf('accountName',splitHost[splitHost.length - 2]);
	this.setConf('target','commentingStage');
	this.finish();
};

/**
 * Hook used to add a process to the end of the constructor.
 *
 * <p>This is called by default, but out of the box  doesn't contain any functionality. Overwrite this method if you want to add your own functionality.</p>
 */
mi.Commenting.prototype.finish = function() {};

/**
 * Calling this method will add commenting features to the page.
 *
 * <p>For commenting to be successfully added the page must have a target element
 * present on the page.</p>
 */
mi.Commenting.prototype.display = function() {
	if(window.gomez && window.gomez.startInterval){window.gomez.startInterval('display commenting');}
	var e = this.getConf('enabled');
	if ( e !== 0 && e !== 2 ) {
		this._renderCommenting();
	} else {
		console.info('Submission and display of comments has been disabled.');
	}
	if(window.gomez && window.gomez.endInterval){window.gomez.endInterval('display commenting');}
};

mi.Commenting.prototype.displayPopular = function(count) {
	if(window.gomez && window.gomez.startInterval){window.gomez.startInterval('popular comment threads');}
	var e = this.getConf('enabled');
	if ( e !== 0 && e !== 3 && e !== 4 ) {
		this._displayPopular(count);
	} else {
		console.info('The popular comment threads widget has been disabled.');
	}
	if(window.gomez && window.gomez.endInterval){window.gomez.endInterval('popular comment threads');}
};

mi.Commenting.prototype.displayCommentCount = function() {
	if(window.gomez && window.gomez.startInterval){window.gomez.startInterval('comment count');}
	var e = this.getConf('enabled');
	if ( e !== 0 && e !== 2 ) {
		this._displayCommentCount();
  } else {
		console.info('Submission and display of comments has been disabled.');
  }
	if(window.gomez && window.gomez.endInterval){window.gomez.endInterval('comment count');}
}

/** ^ MI_Commenting.js ****************************************************** */
