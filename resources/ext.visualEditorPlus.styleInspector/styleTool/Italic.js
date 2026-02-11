ext.visualEditorPlus.ui.ItalicStyleTool = function ( config ) {
	ext.visualEditorPlus.ui.ItalicStyleTool.parent.call( this, config );
};

OO.inheritClass( ext.visualEditorPlus.ui.ItalicStyleTool, ext.visualEditorPlus.ui.ButtonStyleTool );

ext.visualEditorPlus.ui.ItalicStyleTool.prototype.getName = function () {
	return 'textStyle/italic';
};

ext.visualEditorPlus.ui.ItalicStyleTool.prototype.getIcon = function () {
	return 'italic';
};

ext.visualEditorPlus.ui.ItalicStyleTool.prototype.getLabel = function () {
	return OO.ui.deferMsg( 'visualeditor-annotationbutton-italic-tooltip' );
};
