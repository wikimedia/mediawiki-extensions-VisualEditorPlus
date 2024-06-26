ext = window.ext || {};
ext.visualEditorPlus = ext.visualEditorPlus || {};
ext.visualEditorPlus.ui = ext.visualEditorPlus.ui || {};

ext.visualEditorPlus.ui.WrapperSequenceBase = function ExtVisualEditorPlusUiWrapperSequenceBase() {
	ext.visualEditorPlus.ui.WrapperSequenceBase.super.apply( this, [
		this.wrapperSequenceName,
		this.wrapperCommandName,
		new RegExp( this.wrapperWrapChar + '.*?' + this.wrapperWrapChar + '.' ),
		undefined,
		{
			setSelection: true
		} ]
	);
};
OO.inheritClass( ext.visualEditorPlus.ui.WrapperSequenceBase, ve.ui.Sequence );

ext.visualEditorPlus.ui.WrapperSequenceBase.prototype.execute = function ( surface, range ) {
	var surfaceModel = surface.getModel(),
	 firstBackTickRange = new ve.Range( range.start, range.start + 1 ),
	 lastBackTickRange = new ve.Range( range.end - 2, range.end - 1 ),

	 firstBackTickFragment = surfaceModel.getLinearFragment( firstBackTickRange, true, true ),
	 lastBackTickFragment = surfaceModel.getLinearFragment( lastBackTickRange, true, true );

	firstBackTickFragment.removeContent();
	lastBackTickFragment.removeContent();

	range = new ve.Range( range.start, range.end - 3 );
	var parentReturn = ext.visualEditorPlus.ui.WrapperSequenceBase.super.prototype.execute.apply( this, arguments ),

	 newSelection = surfaceModel.getSelection().collapseToEnd(),
	 newRange = newSelection.getRange(),
	 newFragment = surfaceModel.getLinearFragment( newRange, true, true );

	newFragment.insertContent( ' ' ).collapseToEnd().select();

	return parentReturn;
};
