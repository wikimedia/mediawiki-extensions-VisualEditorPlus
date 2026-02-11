ext.visualEditorPlus.ui.BoldStyleTool = function ( config ) {
	ext.visualEditorPlus.ui.BoldStyleTool.parent.call( this, config );
};

OO.inheritClass( ext.visualEditorPlus.ui.BoldStyleTool, ext.visualEditorPlus.ui.ButtonStyleTool );

ext.visualEditorPlus.ui.BoldStyleTool.prototype.getName = function () {
	return 'textStyle/bold';
};

ext.visualEditorPlus.ui.BoldStyleTool.prototype.getIcon = function () {
	return 'bold';
};

ext.visualEditorPlus.ui.BoldStyleTool.prototype.getLabel = function () {
	return OO.ui.deferMsg( 'visualeditor-annotationbutton-bold-tooltip' );
};
