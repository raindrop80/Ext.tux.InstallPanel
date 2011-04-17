
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
 * @author Andrea Cammarata - http://www.andreacammarata.com
 * @class Ext.tux.InstallPanel
 * <p>This is a simple Ext.Application plugin witch display a help panel with application informations,
 * and explain how to "install" the application on iOS devices.</p>
 * <p>Sample Usage</p>
 * <pre><code>
 * Ext.regApplication('AndreaCammarata', {
 *
 * 	  //Set the application name
 *	  name: 'AndreaCammarata',
 *
 *	  //Set the application Icon
 *	  icon: 'icon.png',
 *
 *	  //Definition of Ext.tux.InstallPanel Plugin
 *	  plugins: [new Ext.tux.InstallPanel()],
 *
 *	  //Definizione del punto di ingresso dell'applicazione
 *	  launch: function() {
 *
 *		//Create here your Application Viewport
 *
 *	  }
 *
 * });
 * </code></pre> 
 */
Ext.tux.InstallPanel = Ext.extend(Object, {

	/**
	 * Plugin inizialization function.
	 * @param {Ext.Application} The Application witch this plugin is bind to.
	 */
	init: function(app) {
		
		/* If the application is running on iOS device and the application itself 
		 * has not already added on Home Screen, then let's call the function able to
		 * create and returns the panel to display */
		if((Ext.is.iOS) && (!Ext.is.Standalone)){
		
			//Calling the function able to create the animation
			this.createAnimation();
		
			//Calling the function aple to show the Panel
			this.getPanel(app).show();
			
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
			      '<b>To Install {name}:</b><br/>',
				  '<span>- Tap <img class="x-btn-small" src="{blankImg}" /> button.</span><br/>',
				  '<span>- Then Select</span><br/>',
			   '</div>',
		       '<div class="x-btn-big"></div>',
			   '<div class="x-tip-{pos} x-anchor x-anchor-{pos}"></div>',
		    '</div>'
		);	
			
		
		//Definition of the install Panel
		var p = new Ext.Panel({
			floating: true,
            hideOnMaskTap: false,
			width: 300,
			height: 210,
			cls: 'x-install-panel-anim',
			styleHtmlContent: true,
			dockedItems: {
				xtype: 'toolbar',
				dock: 'top',
				title: 'Install ' + appName
			},
			html: tpl.apply({
				name: appName,
				icon: app.icon,
				blankImg: Ext.BLANK_IMAGE_URL,
				pos: (Ext.is.iPhone ? 'bottom' : 'top')
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
		
		if(appName.length <= 12) return appName;
		else return appName.substr(0,5) + '....' + appName.substr((appName.length-5),5); 
		
	},
	
	/**
	 * @private
	 * Create the animation that will be used to show the Install Panel.
	 */
	createAnimation: function(){
		
		//Definition of used variables
		var style, cls, config;
		
		//Creation of the custom stylesheet witch will contain the panel animation
		style = document.createElement('style');
	    style.type = 'text/css';
		style.id = 'Ext.tux.InstallPanel.Animation';
		
		//Definition of the Animation keyframes template
		var animation = new Ext.Template(
			'@-webkit-keyframes anim-bounce-in {',
		       '0% {',
			      'top: {0-t};',
				  'opacity: 0;',
			   '}',
			   '40% {',
				  'top: {40-t};',
				  'opacity: 1;',
			   '}',
			   '60% {',
			      'top: {60-t};',
			   '}',
			   '100% {',
				  'top: {100-t};',
			   '}',
		    '}'
		);
		
		//Definition of the panel extra cls template
		var cls = new Ext.Template(
			'.x-install-panel-anim {',
			   'top: {100-t};',
			   'left: {100-l};',
			   '-webkit-animation: anim-bounce-in 10s 1;',
			'}'
		);
		
		/* Set the animation and cls params according to the device and orientation
		 * used by the user who is using the application */ 
		if(Ext.is.iPhone || Ext.is.iPhone){
			
			if(Ext.orientation == 'portrait'){
				config = { '0-t': '-80%', '40-t': '40%', '60-t': '30%', '100-t': '47%', '100-l': '3.2%' };
			}else{
				config = { '0-t': '-80%', '40-t': '10%', '60-t': '2%', '100-t': '18%', '100-l': '19%' };
			}
			
		//The application is running on iPad
		}else{
			
			if(Ext.orientation == 'portrait'){
				config = { '0-t': '180%', '40-t': '3%', '60-t': '10%', '100-t': '1%', '100-l': '8%' };
			}else{
				config = { '0-t': '180%', '40-t': '3%', '60-t': '10%', '100-t': '1.4%', '100-l': '6%' };
			}
			
		}
		
		//Let's insert all the created style inside the animation CSS
		style.innerHTML = animation.apply(config) + cls.apply(config);

		//Finally, the custom stylesheet id added to the page Head
	    Ext.getHead().appendChild(style);
		
	}


});