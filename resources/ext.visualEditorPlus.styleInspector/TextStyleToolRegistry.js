ext.visualEditorPlus.TextStyleToolRegistry = function () {
	OO.Registry.call( this );
};

OO.inheritClass( ext.visualEditorPlus.TextStyleToolRegistry, OO.Registry );

ext.visualEditorPlus.registry.TextStyleTool = new ext.visualEditorPlus.TextStyleToolRegistry();

ext.visualEditorPlus.registry.TextStyleTool.register( 'textStyle/bold', { constructor: ext.visualEditorPlus.ui.BoldStyleTool } );
ext.visualEditorPlus.registry.TextStyleTool.register( 'textStyle/italic', { constructor: ext.visualEditorPlus.ui.ItalicStyleTool } );
ext.visualEditorPlus.registry.TextStyleTool.register( 'textStyle/strikethrough', { constructor: ext.visualEditorPlus.ui.StrikethroughStyleTool } );
ext.visualEditorPlus.registry.TextStyleTool.register( 'textStyle/underline', { constructor: ext.visualEditorPlus.ui.UnderlineStyleTool } );
ext.visualEditorPlus.registry.TextStyleTool.register( 'textStyle/small', { constructor: ext.visualEditorPlus.ui.SmallStyleTool } );
ext.visualEditorPlus.registry.TextStyleTool.register( 'textStyle/big', { constructor: ext.visualEditorPlus.ui.BigStyleTool } );
ext.visualEditorPlus.registry.TextStyleTool.register( 'textStyle/code', { constructor: ext.visualEditorPlus.ui.CodeStyleTool } );
