ext.visualEditorPlus.ui.CodeStyleTool = function ( config ) {
	ext.visualEditorPlus.ui.CodeStyleTool.parent.call( this, config );
};

OO.inheritClass( ext.visualEditorPlus.ui.CodeStyleTool, ext.visualEditorPlus.ui.ButtonStyleTool );

ext.visualEditorPlus.ui.CodeStyleTool.prototype.getName = function () {
	return 'textStyle/code';
};

ext.visualEditorPlus.ui.CodeStyleTool.prototype.getIcon = function () {
	return 'code';
};

ext.visualEditorPlus.ui.CodeStyleTool.prototype.getLabel = function () {
	return OO.ui.deferMsg( 'visualeditor-annotationbutton-code-tooltip' );
};
