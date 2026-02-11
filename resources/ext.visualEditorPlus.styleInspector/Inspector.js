ext.visualEditorPlus.ui.TextStyleInspector = function ( inspector, config ) {
	config.padded = false;
	ext.visualEditorPlus.ui.TextStyleInspector.super.call( this, inspector, config );
	this.buttons = {};
	this.addedTools = {};
	this.$element.addClass( 'veplus-ui-TextStyleInspector' );
};

OO.inheritClass( ext.visualEditorPlus.ui.TextStyleInspector, ext.visualEditorPlus.ui.InlineTextInspectorElement );

ext.visualEditorPlus.ui.TextStyleInspector.prototype.inspect = function ( range ) {
	const fragment = this.inspector.target.getSurface().getModel().getLinearFragment( range );
	for ( const name in this.addedTools ) {
		this.addedTools[ name ].setFragment( fragment );
	}
};

ext.visualEditorPlus.ui.TextStyleInspector.prototype.init = function () {
	const registry = ext.visualEditorPlus.registry.TextStyleTool.registry;
	for ( const name in registry ) {
		if ( registry[ name ].hasOwnProperty( 'constructor' ) === false ) {
			continue;
		}
		const tool = registry[ name ].constructor;
		const toolInstance = new tool( { // eslint-disable-line new-cap
			surface: this.inspector.target.getSurface()
		} );
		this.addedTools[ name ] = toolInstance;
		this.$element.append( toolInstance.$element );
	}
};

ext.visualEditorPlus.ui.TextStyleInspector.prototype.getTool = function ( name ) {
	if ( this.addedTools.hasOwnProperty( name ) ) {
		return this.addedTools[ name ];
	}
	return null;
};

ext.visualEditorPlus.ui.TextStyleInspector.prototype.getPriority = function () {
	return 1;
};

ext.visualEditorPlus.registry.inlineTextInspectors.register(
	'VEPlusTextStyleInspector', ext.visualEditorPlus.ui.TextStyleInspector
);
