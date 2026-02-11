ext.visualEditorPlus.ui.StrikethroughStyleTool = function ( config ) {
	ext.visualEditorPlus.ui.StrikethroughStyleTool.parent.call( this, config );
};

OO.inheritClass( ext.visualEditorPlus.ui.StrikethroughStyleTool, ext.visualEditorPlus.ui.ButtonStyleTool );

ext.visualEditorPlus.ui.StrikethroughStyleTool.prototype.getName = function () {
	return 'textStyle/strikethrough';
};

ext.visualEditorPlus.ui.StrikethroughStyleTool.prototype.getIcon = function () {
	return 'strikethrough';
};

ext.visualEditorPlus.ui.StrikethroughStyleTool.prototype.getLabel = function () {
	return OO.ui.deferMsg( 'visualeditor-annotationbutton-strikethrough-tooltip' );
};
