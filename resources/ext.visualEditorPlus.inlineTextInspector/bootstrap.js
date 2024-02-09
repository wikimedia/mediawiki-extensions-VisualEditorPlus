mw.hook( 've.activationComplete' ).add( function () {
	var target = ve.init.target;

	registerInlineTextInspectors( target );
} );

function registerInlineTextInspectors( target ) {
	if ( target.getSurface().getMode() === 'visual' ) {
		var inspectorPopup = new ext.visualEditorPlus.ui.InlineTextInspector( {
			$overlay: true,
		} );
		inspectorPopup.setTarget( target );
		$( document.body ).append( inspectorPopup.$element );

		for ( var key in ext.visualEditorPlus.registry.inlineTextInspectors.registry ) {
			var cls = ext.visualEditorPlus.registry.inlineTextInspectors.registry[ key ],
				instance = new cls( inspectorPopup, {} );
			if ( instance instanceof ext.visualEditorPlus.ui.InlineTextInspectorElement ) {
				inspectorPopup.addInspector( key, instance );
			}
		}
		inspectorPopup.appendInspectors();
	}
}
