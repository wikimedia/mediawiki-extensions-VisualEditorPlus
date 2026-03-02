ext.visualEditorPlus.ui.LinkStyleTool = function ( config ) {
	ext.visualEditorPlus.ui.LinkStyleTool.parent.call( this, config );
};

OO.inheritClass( ext.visualEditorPlus.ui.LinkStyleTool, ext.visualEditorPlus.ui.ButtonStyleTool );

ext.visualEditorPlus.ui.LinkStyleTool.prototype.getName = function () {
	return 'link';
};

ext.visualEditorPlus.ui.LinkStyleTool.prototype.getIcon = function () {
	return 'link';
};

ext.visualEditorPlus.ui.LinkStyleTool.prototype.getLabel = function () {
	return OO.ui.deferMsg( 'visualeditor-annotationbutton-link-tooltip' );
};

ext.visualEditorPlus.ui.LinkStyleTool.prototype.annotate = function () {
	// For links, we want to open the link inspector instead of just toggling
	// This uses executeCommand to properly open the MWLinkAnnotationInspector
	this.surface.executeCommand( 'link' );
};

ext.visualEditorPlus.ui.LinkStyleTool.prototype.getMethod = function () {
	// Override to prevent default toggle behavior
	return 'set';
};
