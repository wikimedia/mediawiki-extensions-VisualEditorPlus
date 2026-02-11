ext.visualEditorPlus.ui.SmallStyleTool = function ( config ) {
	ext.visualEditorPlus.ui.SmallStyleTool.parent.call( this, config );
};

OO.inheritClass( ext.visualEditorPlus.ui.SmallStyleTool, ext.visualEditorPlus.ui.ButtonStyleTool );

ext.visualEditorPlus.ui.SmallStyleTool.prototype.getName = function () {
	return 'textStyle/small';
};

ext.visualEditorPlus.ui.SmallStyleTool.prototype.getIcon = function () {
	return 'smaller';
};

ext.visualEditorPlus.ui.SmallStyleTool.prototype.getLabel = function () {
	return OO.ui.deferMsg( 'visualeditor-annotationbutton-small-tooltip' );
};
