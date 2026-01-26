ext = window.ext || {};
ext.visualEditorPlus = ext.visualEditorPlus || {};
ext.visualEditorPlus.table = ext.visualEditorPlus.table || {};

ext.visualEditorPlus.table.ImprovedTableContextItem = function ( context, model, config ) {
	ext.visualEditorPlus.table.ImprovedTableContextItem.super.call( this, context, model, config );

	this.context = context;
	this.actions = [];
	this.quickCellActions = [ 'bold', 'italic', 'underline' ];
	mw.hook( 'visualeditorplus.table.actions' ).fire( this, this.actions );

	this.setupCellActions();

	this.deleteButton = new OO.ui.ButtonWidget( {
		label: ve.msg( 'visualeditorplus-table-contextitemwidget-label-remove' ),
		flags: [ 'destructive' ],
		invisibleLabel: true,
		icon: 'trash',
		framed: false
	} );
	this.deleteButton.connect( this, { click: 'onDeleteButtonClick' } );
	this.updateEditButton();
	this.actionButtons.addItems( [ this.editButton, this.deleteButton ] );

	this.$element.addClass( 'ext-visualeditorplus-tableContextItem' );
};

/* Inheritance */

OO.inheritClass( ext.visualEditorPlus.table.ImprovedTableContextItem, ve.ui.LinearContextItem );

/* Static Properties */
ext.visualEditorPlus.table.ImprovedTableContextItem.static.embeddable = false;

ext.visualEditorPlus.table.ImprovedTableContextItem.static.name = 'table';

ext.visualEditorPlus.table.ImprovedTableContextItem.static.icon = 'table';

ext.visualEditorPlus.table.ImprovedTableContextItem.static.commandName = 'table';

ext.visualEditorPlus.table.ImprovedTableContextItem.static.embeddable = false;

ext.visualEditorPlus.table.ImprovedTableContextItem.static.isCompatibleWith = function ( model ) {
	return model instanceof ve.dm.Node && model.isCellable();
};

ext.visualEditorPlus.table.ImprovedTableContextItem.prototype.updateEditButton = function () {
	this.editButton.clearFlags();
	this.editButton.setIcon( 'settings' );
	this.editButton.setLabel( ve.msg( 'visualeditorplus-table-contextitem-properties-label' ) );
	this.editButton.setTitle( ve.msg( 'visualeditorplus-table-contextitem-properties-label' ) );
	this.editButton.setInvisibleLabel( true );
	this.editButton.toggleFramed();
};

ext.visualEditorPlus.table.ImprovedTableContextItem.prototype.setupCellActions = function () {
	this.$cellAction = $( '<div>' ).addClass( 'ext-visualeditorplus-tableContextItem-cellAction' );
	this.cellActionButtons = new OO.ui.ButtonGroupWidget();

	const quickActions = [];
	for ( const i in this.quickCellActions ) {
		const action = this.quickCellActions[ i ];
		// The following messages are used here
		// * visualeditor-annotationbutton-bold-tooltip
		// * visualeditor-annotationbutton-italic-tooltip
		// * visualeditor-annotationbutton-underline-tooltip
		const button = new OO.ui.ButtonWidget( {
			icon: action,
			label: ve.msg( 'visualeditor-annotationbutton-' + action + '-tooltip' ),
			invisibleLabel: true,
			framed: false
		} );
		button.connect( this, {
			click: () => {
				this.execCommand( action );
			}
		} );
		quickActions.push( button );
	}

	this.enhancedActions = [];
	for ( const action in this.actions ) {
		if ( this.actions[ action ].displaySection === 'quick' ) {
			if ( !this.actions[ action ].hasOwnProperty( 'widget' ) ) {
				continue;
			}
			const widgetClass = this.actions[ action ].widget;
			quickActions.push( new widgetClass( this ) ); // eslint-disable-line new-cap
		} else {
			this.enhancedActions.push( this.actions[ action ] );
		}
	}

	if ( this.enhancedActions.length > 0 ) {
		this.moreActionButton = new OO.ui.ButtonWidget( {
			label: ve.msg( 'visualeditorplus-table-contextitem-additional-options-label' ),
			invisibleLabel: true,
			icon: 'menu',
			framed: false
		} );
		this.moreActionButton.connect( this, {
			click: 'showMoreActions'
		} );
		quickActions.push( this.moreActionButton );
	}

	this.cellActionButtons.addItems( quickActions );
	this.$head.prepend( this.$cellAction.append( this.cellActionButtons.$element ) );
};

ext.visualEditorPlus.table.ImprovedTableContextItem.prototype.showMoreActions = function () {
	const additionalActionsDialog = new ext.visualEditorPlus.table.dialog.AdditionalActionsDialog(
		this.enhancedActions, this );

	const windowManager = new OO.ui.WindowManager();
	$( document.body ).append( windowManager.$element );
	windowManager.addWindows( [ additionalActionsDialog ] );
	const selection = this.context.getSurface().getModel().getSelection();
	windowManager.openWindow( additionalActionsDialog ).closed.then( ( data ) => {
		// We need to execute actions after the dialog is closed and selection is restore,
		// because, as soon as we click on a dialog table selection is gone
		this.context.getSurface().getModel().setSelection( selection );
		if ( !data ) {
			return;
		}
		this.executeAdditionalActions( data.actionsToExecute );
	} );
};

ext.visualEditorPlus.table.ImprovedTableContextItem.prototype.onDeleteButtonClick = function () {
	const surfaceModel = this.getFragment().getSurface();

	surfaceModel.getLinearFragment(
		surfaceModel.getSelectedNode().findParent( ve.dm.TableNode ).getOuterRange()
	).delete();

	ve.track( 'activity.table', { action: 'context-delete' } );
};

ext.visualEditorPlus.table.ImprovedTableContextItem.prototype.executeAdditionalActions = function ( actions ) {
	let command;
	for ( command in actions ) {
		if ( !actions.hasOwnProperty( command ) ) {
			continue;
		}
		actions[ command ].setShouldExecute( true );
		actions[ command ].executeAction();
	}
};

ext.visualEditorPlus.table.ImprovedTableContextItem.prototype.getWidgetFromConfig = function ( cmd, commandConfig ) {
	let widgetClass;

	if ( commandConfig.hasOwnProperty( 'widget' ) ) {
		widgetClass = commandConfig.widget;
		return new widgetClass( this ); // eslint-disable-line new-cap
	} else {
		return new OO.ui.ButtonWidget( this, {
			icon: commandConfig.icon,
			title: commandConfig.label,
			framed: false,
			command: cmd,
			expensive: commandConfig.expensive || false
		} );
	}
};

ext.visualEditorPlus.table.ImprovedTableContextItem.prototype.getStyles = function () {
	if ( this.model.element.type !== 'tableCell' ) {
		return {};
	}
	return this.model.element;
};

ext.visualEditorPlus.table.ImprovedTableContextItem.prototype.getCommand = function ( command ) {
	if ( command ) {
		return this.context.getSurface().commandRegistry.lookup( command );
	}
	return ext.visualEditorPlus.table.ImprovedTableContextItem.parent.prototype.getCommand.call( this, arguments );

};

ext.visualEditorPlus.table.ImprovedTableContextItem.prototype.execCommand = function ( command, args ) {
	const cmd = this.getCommand( command );
	args = args || cmd.getArgs();

	if ( !Array.isArray( args ) ) {
		args = [ args ];
	}
	if ( cmd ) {
		cmd.execute( this.context.getSurface(), args );
		this.emit( 'command' );
	}
};

ve.ui.contextItemFactory.register( ext.visualEditorPlus.table.ImprovedTableContextItem );
