ext.visualEditorPlus.ui.tag.WrapperDefinition = function ( spec ) {
	ext.visualEditorPlus.ui.tag.WrapperDefinition.super.call( this, spec );
	this.containerElementName = spec.containerElementName || 'div';
};

OO.inheritClass( ext.visualEditorPlus.ui.tag.WrapperDefinition, ext.visualEditorPlus.ui.tag.Definition );

ext.visualEditorPlus.ui.tag.WrapperDefinition.prototype.getChildTypes = function () {
	// All types
	return null;
};

ext.visualEditorPlus.ui.tag.WrapperDefinition.prototype.getHeaderText = function () {
	return this.description;
};

ext.visualEditorPlus.ui.tag.WrapperDefinition.prototype.getClassname = function ( suffix ) {
	return this.classname + ( suffix || '' );
};

ext.visualEditorPlus.ui.tag.WrapperDefinition.prototype.getCSSClassname = function () {
	return 'wrapper-' + this.tagname;
};

ext.visualEditorPlus.ui.tag.WrapperDefinition.prototype.onAttributeChange = function ( ce, attributeName, value ) { // eslint-disable-line no-unused-vars
	// NOOP
};

ext.visualEditorPlus.ui.tag.WrapperDefinition.prototype.getCommandArgs = function () {
	return [ this.tagname, {} ];
};

ext.visualEditorPlus.ui.tag.WrapperDefinition.prototype.register = function () {
	this.registerDm();
	this.registerCe();
	this.registerContextItem();
	this.registerAction();
};

ext.visualEditorPlus.ui.tag.WrapperDefinition.prototype.registerDm = function () {
	const definition = this;
	const classname = this.getClassname( 'Node' );
	ext.visualEditorPlus.dm[ classname ] = function () {
		ext.visualEditorPlus.dm[ classname ].super.apply( this, arguments );
	};

	OO.inheritClass( ext.visualEditorPlus.dm[ classname ], ve.dm.BranchNode );

	ext.visualEditorPlus.dm[ classname ].static.name = this.tagname;
	// This means that it only supports sub-children no direct text inside
	ext.visualEditorPlus.dm[ classname ].static.canContainContent = false;
	// It is a wrapper for content, no content
	ext.visualEditorPlus.dm[ classname ].static.isContent = false;
	// Focusable so VE positions the context item on the block itself
	ext.visualEditorPlus.dm[ classname ].static.isFocusable = true;

	const cssClassname = this.getCSSClassname();
	ext.visualEditorPlus.dm[ classname ].static.matchFunction = function ( element ) {
		return element.nodeName === definition.containerElementName.toUpperCase() &&
			element.classList.contains( 'wrapper-container' ) &&
			element.classList.contains( cssClassname );
	};

	ext.visualEditorPlus.dm[ classname ].static.toDataElement = function ( domElements ) {
		// Get all data attributes from domElements[0]
		const dataAttributes = {};
		for ( const attr of domElements[ 0 ].attributes ) {
			if ( attr.name.startsWith( 'data-' ) ) {
				// Strip `data-`
				const key = attr.name.slice( 5 );
				dataAttributes[ key ] = attr.value;
			}
		}
		return {
			type: definition.tagname,
			attributes: dataAttributes
		};
	};

	ext.visualEditorPlus.dm[ classname ].static.toDomElements = function ( dataElement, doc ) {
		const domElement = doc.createElement( definition.containerElementName );
		domElement.classList.add( 'wrapper-container' );
		domElement.classList.add( definition.getCSSClassname() ); // eslint-disable-line mediawiki/class-doc
		for ( const key in dataElement.attributes ) {
			if ( dataElement.attributes.hasOwnProperty( key ) ) {
				domElement.setAttribute( 'data-' + key, dataElement.attributes[ key ] );
			}
		}
		return [ domElement ];
	};

	ve.dm.modelRegistry.register( ext.visualEditorPlus.dm[ classname ] );

	// Patch suggestedParentNodeTypes for nodes that restrict their parents,
	// so they can be placed inside wrapper nodes without splitting.
	const wrapperType = definition.tagname;
	const nodeClassesToPatch = [ 'MWTableNode', 'MWHeadingNode', 'MWPreformattedNode' ];
	for ( const nodeClass of nodeClassesToPatch ) {
		if ( ve.dm[ nodeClass ] && ve.dm[ nodeClass ].static.suggestedParentNodeTypes ) {
			if ( ve.dm[ nodeClass ].static.suggestedParentNodeTypes.includes( wrapperType ) ) {
				ve.dm[ nodeClass ].static.suggestedParentNodeTypes.push( wrapperType );
			}
		}
	}
};

ext.visualEditorPlus.ui.tag.WrapperDefinition.prototype.registerCe = function () {
	const definition = this;
	const classname = this.getClassname( 'Node' );
	ext.visualEditorPlus.ce[ classname ] = function () {
		ext.visualEditorPlus.ce[ classname ].super.apply( this, arguments );
		this.$element.addClass( 'wrapper-container' );
		this.$element.addClass( definition.getCSSClassname() ); // eslint-disable-line mediawiki/class-doc

		this.$header = $( '<div>' )
			.addClass( 'wrapper-header' )
			.attr( 'contenteditable', 'false' )
			.html( definition.getHeaderText() );

		// FocusableNode: only header clicks trigger focus; bounding rect covers whole block
		ve.ce.FocusableNode.call( this, this.$header, this.$element );

		// FocusableNode sets contentEditable=false on $element; restore it so
		// content inside the wrapper remains editable.
		this.$element.prop( 'contentEditable', 'true' );

		// In timeout, to let VE add all its content first
		setTimeout( () => {
			this.$element.prepend( this.$header );
		}, 100 );

		// Listen to model attribute change
		this.model.on( 'attributeChange', ( attributeName ) => {
			definition.onAttributeChange( this, attributeName, this.model.getAttributes() );
		} );
		// Init values
		definition.onAttributeChange( this, null, this.model.getAttributes() );
	};

	OO.inheritClass( ext.visualEditorPlus.ce[ classname ], ve.ce.BranchNode );
	OO.mixinClass( ext.visualEditorPlus.ce[ classname ], ve.ce.FocusableNode );

	ext.visualEditorPlus.ce[ classname ].static.name = definition.tagname;
	ext.visualEditorPlus.ce[ classname ].static.childNodeTypes = definition.getChildTypes();

	ext.visualEditorPlus.ce[ classname ].prototype.setFocused = function ( value ) {
		value = !!value;
		if ( this.focused !== value ) {
			this.focused = value;
			if ( this.focused ) {
				this.emit( 'focus' );
				this.$element.addClass( 've-ce-focusableNode-focused' );
				// Skip createHighlights: overlays would block content editing
			} else {
				this.emit( 'blur' );
				this.$element.removeClass( 've-ce-focusableNode-focused' );
				this.clearHighlights();
			}
		}
		this.$element.toggleClass( 'selected', !!value );
	};

	ve.ce.nodeFactory.register( ext.visualEditorPlus.ce[ classname ] );
};

ext.visualEditorPlus.ui.tag.WrapperDefinition.prototype.registerContextItem = function () {
	const definition = this;
	const classname = this.getClassname( 'ContextItem' );
	ext.visualEditorPlus.ui[ classname ] = function ( context, model, config ) {
		ext.visualEditorPlus.ui[ classname ].super.call( this, context, model, config );

		this.unwrapButton = new OO.ui.ButtonWidget( {
			label: ve.msg( 'visualeditorplus-ui-label-unwrap' ),
			flags: [ 'destructive' ]
		} );
		this.unwrapButton.connect( this, { click: 'onUnwrapClick' } );

		this.deleteButton = new OO.ui.ButtonWidget( {
			label: ve.msg( 'visualeditorplus-ui-label-delete' ),
			flags: [ 'destructive', 'primary' ]
		} );
		this.deleteButton.connect( this, { click: 'onDeleteButtonClick' } );

		this.actionButtons.addItems( [ this.unwrapButton, this.deleteButton ] );
	};

	OO.inheritClass( ext.visualEditorPlus.ui[ classname ], ve.ui.LinearContextItem );

	ext.visualEditorPlus.ui[ classname ].static.name = definition.tagname;

	ext.visualEditorPlus.ui[ classname ].static.modelClasses = [
		ext.visualEditorPlus.dm[ this.getClassname( 'Node' ) ]
	];

	ext.visualEditorPlus.ui[ classname ].static.commandName = null;
	ext.visualEditorPlus.ui[ classname ].static.editable = false;
	ext.visualEditorPlus.ui[ classname ].static.embeddable = false;

	ext.visualEditorPlus.ui[ classname ].prototype.renderBody = function () {

		definition.createForm( this ).done( ( form ) => {
			if ( !form ) {
				return;
			}
			this.inspectorForm = form;
			this.inspectorForm.render();
			this.$body.append( this.inspectorForm.$element );
			definition.setValues( this, this.model.getAttributes() );
		} ).fail( ( error ) => {
			console.error( error ); // eslint-disable-line no-console
		} );
	};

	ext.visualEditorPlus.ui[ classname ].prototype.onChangeHandler = function () {
		const surfaceModel = this.context.getSurface().getModel();
		// Prevent context rebuild while updating attributes
		const contextEvents = {
			documentUpdate: 'onDocumentUpdate',
			contextChange: 'onContextChange'
		};
		surfaceModel.disconnect( this.context, contextEvents );
		surfaceModel.change(
			ve.dm.TransactionBuilder.static.newFromAttributeChanges(
				surfaceModel.getDocument(),
				this.model.getOffset(),
				this.value
			)
		);
		surfaceModel.connect( this.context, contextEvents );
	};

	ext.visualEditorPlus.ui[ classname ].prototype.updateSize = function () {
		// NOOP
	};

	ext.visualEditorPlus.ui[ classname ].prototype.onUnwrapClick = function () {
		const surfaceModel = this.context.getSurface().getModel();
		const endOffset = this.model.getOuterRange().end;
		surfaceModel.change(
			ve.dm.TransactionBuilder.static.newFromWrap(
				surfaceModel.getDocument(),
				this.model.getRange(),
				[ this.model.getClonedElement() ],
				[],
				[],
				[]
			)
		);
		surfaceModel.setLinearSelection( new ve.Range( endOffset - 2 ) );
	};

	ext.visualEditorPlus.ui[ classname ].prototype.onDeleteButtonClick = function () {
		const surfaceModel = this.context.getSurface().getModel();
		surfaceModel.getLinearFragment( this.model.getOuterRange(), true ).delete();
	};

	ve.ui.contextItemFactory.register( ext.visualEditorPlus.ui[ classname ] );

};

ext.visualEditorPlus.ui.tag.WrapperDefinition.prototype.registerAction = function () {
	const classname = this.getClassname( 'Command' );

	ve.ui.commandRegistry.register(
		new ve.ui.Command( classname, 'wrapper-tag', 'toggle', {
			supportedSelections: [ 'linear' ],
			args: this.getCommandArgs()
		} )
	);
};
