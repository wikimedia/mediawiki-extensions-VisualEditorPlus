ext.visualEditorPlus.ui.InlineTextInspector = function ( config ) {
	config = config || {};
	config.padded = false;
	config.$container = $( document.body );
	config.$overlay = true;
	config.position = 'below';
	config.autoFlip = false;
	ext.visualEditorPlus.ui.InlineTextInspector.super.call( this, config );
	this.inspectors = [];

	this.$element.addClass( 'ext-visualEditorPlus-inlineTextInspector' );

	this.target = null;
};

OO.inheritClass( ext.visualEditorPlus.ui.InlineTextInspector, OO.ui.PopupWidget );

ext.visualEditorPlus.ui.InlineTextInspector.prototype.setTarget = function ( target ) {
	this.target = target;
	this.init();
};

ext.visualEditorPlus.ui.InlineTextInspector.prototype.addInspector = function ( name, inspector ) {
	this.inspectors.push( inspector );
	inspector.init();
};

ext.visualEditorPlus.ui.InlineTextInspector.prototype.appendInspectors = function () {
	var header, i;
	this.inspectors.sort( function ( a, b ) {
		return a.getPriority() - b.getPriority();
	} );
	for ( i = 0; i < this.inspectors.length; i++ ) {
		header = this.inspectors[ i ].getHeader();
		if ( header ) {
			this.inspectors[ i ].$element.prepend( header.$element );
		}
		this.$body.append( this.inspectors[ i ].$element );
	}
};

ext.visualEditorPlus.ui.InlineTextInspector.prototype.init = function () {
	this.surface = this.target.getSurface();
	this.surfaceModel = this.surface.getModel();
	this.selection = null;
	this.selectedNode = null;

	this.surfaceModel.on( 'select', this.onSelection.bind( this )  );
	this.target.getToolbar().on( 'updateState', this.onToolbarUpdateState.bind( this ) );
	$( document ).on( 'mousedown', this.onMouseDown.bind( this ) );
	$( document ).on( 'mouseup', this.onMouseUp.bind( this ) );
	$( window ).on( 'resize', this.onResize.bind( this ) );
};

ext.visualEditorPlus.ui.InlineTextInspector.prototype.onSelection = function ( selection ) {
	if ( !( selection instanceof ve.dm.LinearSelection ) ) {
		return;
	}
	this.selection = selection;
	this.selectedNode = this.surfaceModel.getSelectedNode();
};

ext.visualEditorPlus.ui.InlineTextInspector.prototype.onToolbarUpdateState = function () {
	this.toggle( false );
};

ext.visualEditorPlus.ui.InlineTextInspector.prototype.onMouseDown = function ( e ) {
	if ( e.which !== 1 ) {
		return;
	}
	if ( this.shouldHide( e ) ) {
		this.toggle( false );
	}
	if ( !this.isVisible() ) {
		this.location = {
			start: {
				x: e.pageX,
				y: e.pageY
			}
		};
	}
};

ext.visualEditorPlus.ui.InlineTextInspector.prototype.onMouseUp = function ( e ) {
	var range, selectedText, strLength;
	if ( !this.location || this.isVisible() ) {
		return;
	}
	this.location.end = {
		x: e.pageX,
		y: e.pageY
	};
	if ( !this.selection ) {
		return;
	}
	range = this.selection.getRange();
	selectedText = window.getSelection().toString();
	strLength = selectedText.trim().length;
	if ( strLength ) {
		this.inspect( range, selectedText );
	}
};

ext.visualEditorPlus.ui.InlineTextInspector.prototype.onResize = function () {
	this.toggle( false );
};

ext.visualEditorPlus.ui.InlineTextInspector.prototype.shouldHide = function ( e ) {
	var $target = $( e.target );
	if ( $target.hasClass( 'ext-visualEditorPlus-inlineTextInspector' ) ) {
		return false;
	}
	if ( $target.parents( '.ext-visualEditorPlus-inlineTextInspector' ).length !== 0 ) {
		return false;
	}

	return true;
};

ext.visualEditorPlus.ui.InlineTextInspector.prototype.inspect = function ( range, selectedText ) {
	var i;
	this.toggle( true );
	for ( i = 0; i < this.inspectors.length; i++ ) {
		this.inspectors[ i ].inspect( range, selectedText );
	}
};

ext.visualEditorPlus.ui.InlineTextInspector.prototype.positionPopup = function () {
	var targetContainerOffset, xStart, xEnd, horizontal, pos, targetOffset;
	if ( !this.isVisible() ) {
		return;
	}
	if ( !this.location || !this.location.hasOwnProperty( 'start' ) || !this.location.hasOwnProperty( 'end' ) ) {
		return;
	}

	targetOffset = $( '.ve-init-target' ).offset();
	targetContainerOffset =  targetOffset ? targetOffset : { top: 0, left: 0 };
	targetContainerOffset = targetContainerOffset.left;
	xStart = this.location.start.x;
	xEnd = this.location.end.x;
	horizontal = xStart < xEnd ? xStart : xEnd;
	if ( horizontal < targetContainerOffset ) {
		// Show as left as possible, but don't go off the left edge of the editor
		horizontal = targetContainerOffset;
	}
	pos = {
		top: this.location.start.y + 20, // For anchor
		left: horizontal
	};

	this.$element.css( {
		position: 'absolute',
		top: pos.top,
		left: pos.left
	} );
	this.$body.css( 'height', 'auto' );
	this.$anchor.css( {
		left: '10px'
	} );
	this.$element.removeClass( 'oo-ui-element-hidden' );
};

ext.visualEditorPlus.ui.InlineTextInspector.prototype.toggle = function ( show ) {
	var i;
	ext.visualEditorPlus.ui.InlineTextInspector.parent.prototype.toggle.call( this, show );
	if ( show ) {
		this.positionPopup();
	} else {
		for( i = 0; i < this.inspectors.length; i++ ) {
			this.inspectors[i].onClose();
		}
		if ( this.selection ) {
			this.selection.collapseToEnd();
		}
	}
};
