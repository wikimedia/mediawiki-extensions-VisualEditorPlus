ext.visualEditorPlus.ui.UnderlineStyleTool = function ( config ) {
	ext.visualEditorPlus.ui.UnderlineStyleTool.parent.call( this, config );
};

OO.inheritClass( ext.visualEditorPlus.ui.UnderlineStyleTool, ext.visualEditorPlus.ui.ButtonStyleTool );

ext.visualEditorPlus.ui.UnderlineStyleTool.prototype.getName = function () {
	return 'textStyle/underline';
};

ext.visualEditorPlus.ui.UnderlineStyleTool.prototype.getIcon = function () {
	return 'underline';
};

ext.visualEditorPlus.ui.UnderlineStyleTool.prototype.getLabel = function () {
	return OO.ui.deferMsg( 'visualeditor-annotationbutton-underline-tooltip' );
};
