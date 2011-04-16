
/* I need to override the Ext.Application onReady function to allow
 * the Application itself to manage plugins */
Ext.override(Ext.Application, {
	
	onReady: function() {
		
	    if (this.useLoadMask) {
            this.initLoadMask();
        }

        Ext.EventManager.onOrientationChange(this.determineProfile, this);

        if (this.autoInitViewport) {
            Ext.Viewport.init(this.onBeforeLaunch, this);
        } else {
            this.onBeforeLaunch();
        }

		//Initalize all the Application Plugins
		Ext.each(this.plugins, function(plugin){
			plugin.init(this);
		}, this);
		
        return this;
    }
});
		


//Definition of Touch User Extension Namespace
Ext.ns('Ext.tux');

/** 
 * @constructor
 * Create a new Install Panel
 * @param {Object} config The config object 
*/
Ext.tux.InstallPanel = Ext.extend(Object, {

	/**
	 * Plugin inizialization function.
	 * @param {Ext.Application} The Application witch this plugin is bind to.
	 */
	init: function(app) {
		
		/* if the application is running on iOS device and the application itself 
		 * has not already added on Home Screen, then let's call the function able to
		 * create and returns the panel to display */
		if((Ext.is.iOS) && (!Ext.is.Standalone)){
		
			//Calling the function aple to show the Panel
			this.getPanel(app).show({type: 'pop', duration: 1500});
			
		}

	},
	
	/**
	 * @private
	 * Create and returns the Help panel tho show on plugin initialization.
	 * @param {Ext.Application} The Application witch this plugin is bind to.
	 * @return {Exp.Panel} The Ext.Panel that will display th application informations and
	 * explain to the user how to "install" the application on his mobile device.
	 */ 
	getPanel: function(app){

		//Let's call the function able to format the application name
		var appName = this.formatAppName(app.name);

		/* Definition of the HTML template that will be use inside the panel */
		var tpl = new Ext.Template(
			'<div class="x-install-pnl">',
			   '<div class="x-icon">',
			   	  '<img src="{icon}" />',
			   '</div>',
			   '<div class="x-desc">',
			      '<b>To Install {name}</b><br/>',
				  '<span>- Tap <img class="x-btn-small" src="{blankImg}" /> Below</span><br/>' +
				  '<span>- Then Select</span><br/>' +
			   '</div>',
		       '<div class="x-btn-big"></div>',
		    '</div>'
		);

		//Let's defined the install Panel
		var p = new Ext.Panel({
			floating: true,
            hideOnMaskTap: false,
			width: 300,
			height: 210,
			centered: true,
			styleHtmlContent: true,
			dockedItems: {
				xtype: 'toolbar',
				dock: 'top',
				title: 'Install ' + appName
			},
			html: tpl.apply({
				name: appName,
				icon: app.icon,
				blankImg: Ext.BLANK_IMAGE_URL
			})
		});

		//Returns the created Panel
		return p;
	},
	
	/**
	 * @private
	 * Format the application name if this exced the 12 max supported.
	 * @param {String} The Application name.
	 * @return {String} The formatted Application name.
	 */
	formatAppName: function(appName){
		
		if(appName.length <= 12) {
			return appName
		}else{
			var len = appName.length;
			return appName.substr(0,5) + '....' + appName.substr((len-5),5); 
		}
		
	}

});