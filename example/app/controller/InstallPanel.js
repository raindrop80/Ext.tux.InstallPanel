Ext.define('Example.controller.InstallPanel', {
    extend: 'Ext.app.Controller',
	views: ['InstallPanel'],
    init: function() {
        
		var pnl = Ext.widget('installPanel');
		
		pnl.show();

    }
});