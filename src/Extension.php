<?php

namespace MediaWiki\Extension\VisualEditorPlus;

class Extension {

	public static function callback() {
		\mwsInitComponents();
		if ( isset( $GLOBALS[ 'wgVisualEditorPreloadModules' ] ) ) {
			$GLOBALS[ 'wgVisualEditorPreloadModules' ][] = "ext.visualEditorPlus.tags";
		}
	}
}
