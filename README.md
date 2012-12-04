#Ext.tux.InstallPanel

Simple Ext.Application plugin witch display an help panel reporting some application informations,
and explain how to "install" the application on iOS devices.

##How to Use

All you need to do is to include the plugin directly on the application definition, after setting its the name and icon.

    Ext.regApplication('AndreaCammarata', {

        // Set the application name
        name: 'AndreaCammarata',
        
        // Set the application Icon
        icon: 'icon.png',
        
        // Use the Ext.tux.InstallPanel Plugin
        plugins: [new Ext.tux.InstallPanel()],
        
        launch: function() {
        
            // Create here your Application Viewport

    }

##Contributors

    Andrea Cammarata