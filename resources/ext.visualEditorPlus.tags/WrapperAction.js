ext.visualEditorPlus.ve.WrapperTagAction = function () {
	ext.visualEditorPlus.ve.WrapperTagAction.super.apply( this, arguments );
};

OO.inheritClass( ext.visualEditorPlus.ve.WrapperTagAction, ve.ui.Action );

ext.visualEditorPlus.ve.WrapperTagAction.static.name = 'wrapper-tag';
ext.visualEditorPlus.ve.WrapperTagAction.static.methods = [ 'toggle' ];

ext.visualEditorPlus.ve.WrapperTagAction.prototype.toggle = function ( tagname, attributes ) {
	const surfaceModel = this.surface.getModel();
	const fragment = surfaceModel.getFragment();
	const selection = fragment.getSelection();

	if ( !( selection instanceof ve.dm.LinearSelection ) ) {
		return false;
	}

	const range = selection.getRange();
	const document = surfaceModel.getDocument();

	// Prevent nesting: check if cursor is already inside a node of the same type
	let node = document.getBranchNodeFromOffset( range.start );
	while ( node ) {
		if ( node.getType() === tagname ) {
			return false;
		}
		node = node.getParent();
	}

	if ( range.isCollapsed() ) {
		// Nothing is selected - empty block
		const offset = range.start;
		fragment.insertContent( [
			{ type: tagname, attributes: attributes },
			{ type: 'paragraph' },
			{ type: '/paragraph' },
			{ type: '/' + tagname }
		] );
		// Place cursor inside the empty paragraph
		surfaceModel.setLinearSelection( new ve.Range( offset + 2 ) );
	} else {
		// Wrap selected content
		// Expand range to cover complete block nodes
		const startNode = document.getBranchNodeFromOffset( range.start );
		const endNode = document.getBranchNodeFromOffset( range.end );
		const wrapRange = new ve.Range(
			startNode.getOuterRange().start,
			endNode.getOuterRange().end
		);
		surfaceModel.change(
			ve.dm.TransactionBuilder.static.newFromWrap(
				document,
				wrapRange,
				[],
				[ { type: tagname, attributes: attributes } ],
				[],
				[]
			)
		);
	}

	return true;
};

ve.ui.actionFactory.register( ext.visualEditorPlus.ve.WrapperTagAction );
