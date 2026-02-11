ext.visualEditorPlus.ui.ButtonStyleTool = function ( config ) {
	config = config || {};

	this.surface = config.surface;
	this.surfaceModel = config.surface.model;

	this.annotationAction = config.annotationAction || null;

	config.icon = this.getIcon();
	config.title = this.getLabel();
	config.framed = false;

	ext.visualEditorPlus.ui.ButtonStyleTool.parent.call( this, config );

	this.changeActive();

	this.connect( this, {
		click: 'annotate'
	} );
	this.$element.css( {
		margin: '0 5px 0 0'
	} );
};

OO.inheritClass( ext.visualEditorPlus.ui.ButtonStyleTool, OO.ui.ButtonWidget );

ext.visualEditorPlus.ui.ButtonStyleTool.prototype.annotate = function () {
	if ( !this.annotationAction ) {
		this.annotationAction = new ve.ui.AnnotationAction( this.surface );
	}
	const method = this.getMethod();
	if ( ve.ui.AnnotationAction.static.methods.indexOf( method ) === -1 ) {
		return;
	}
	const annotationData = {
		attributes: this.getData(),
		type: this.getName()
	};

	if ( this.annotationAction[ method ]( this.getName(), annotationData ) ) {
		this.changeActive();
	}
};

ext.visualEditorPlus.ui.ButtonStyleTool.prototype.setFragment = function ( fragment ) {
	this.fragment = fragment;
	this.changeActive();
};

ext.visualEditorPlus.ui.ButtonStyleTool.prototype.clearAnnotation = function () {
	if ( !this.annotationAction ) {
		this.annotationAction = new ve.ui.AnnotationAction( this.surface );
	}
	this.annotationAction.clear( this.getName() );
};

ext.visualEditorPlus.ui.ButtonStyleTool.prototype.getName = function () {
	// STUB
};

ext.visualEditorPlus.ui.ButtonStyleTool.prototype.getData = function () {
	// undefined
	return;
};

ext.visualEditorPlus.ui.ButtonStyleTool.prototype.getMethod = function () {
	return 'toggle';
};

ext.visualEditorPlus.ui.ButtonStyleTool.prototype.getIcon = function () {
	// STUB
};

ext.visualEditorPlus.ui.ButtonStyleTool.prototype.getLabel = function () {
	// STUB
};

ext.visualEditorPlus.ui.ButtonStyleTool.prototype.changeActive = function () {
	if ( this.isActive() ) {
		this.setFlags( [ 'primary', 'progressive' ] );
	} else {
		this.clearFlags();
	}
};

ext.visualEditorPlus.ui.ButtonStyleTool.prototype.isActive = function () {
	if ( !this.fragment ) {
		return false;
	}
	const annotations = this.fragment.getAnnotations().getAnnotationsByName( this.getName() );
	if ( annotations.getHashes().length > 0 ) {
		return true;
	}
	return false;
};
