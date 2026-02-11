ext.visualEditorPlus.ui.BigStyleTool = function ( config ) {
	ext.visualEditorPlus.ui.BigStyleTool.parent.call( this, config );
};

OO.inheritClass( ext.visualEditorPlus.ui.BigStyleTool, ext.visualEditorPlus.ui.ButtonStyleTool );

ext.visualEditorPlus.ui.BigStyleTool.prototype.getName = function () {
	return 'textStyle/big';
};

ext.visualEditorPlus.ui.BigStyleTool.prototype.getIcon = function () {
	return 'bigger';
};

ext.visualEditorPlus.ui.BigStyleTool.prototype.getLabel = function () {
	return OO.ui.deferMsg( 'visualeditor-annotationbutton-big-tooltip' );
};
