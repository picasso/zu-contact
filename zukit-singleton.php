<?php

// The zukit_Singleton class defines the `instance` method that serves as an
// alternative to constructor and lets clients access the same instance of this
// class over and over.
class zukit_Singleton {

    public $prefix;
    public $version;
    public $dir;
    public $uri;
    public $debug;

    // The zukit_Singleton's instance is stored in a static property. This property is an
    // array, because we'll allow our zukit_Singleton to have subclasses. Each item in
    // this array will be an instance of a specific zukit_Singleton's subclass.
    private static $instances = [];

    // We can only have one definition of the 'zukit_Singleton' class and therefore
    // store its location in a static property so that we can access its JS and CSS files later.
    private static $zukit_file = __FILE__;

    // The zukit_Singleton's constructor should always be private to prevent direct
    // construction calls with the `new` operator.
    private function __construct($params) {
        $theme = wp_get_theme();
        $this->dir = get_stylesheet_directory();
        $this->uri = get_stylesheet_directory_uri();
        $this->prefix = str_replace(' ', '_', strtolower($theme->get('Name')));
        $this->version = $theme->get('Version');
        $this->debug = false;
        $this->config_singleton($params);
        $this->construct_more();
    }

    // singleton should not be cloneable.
    final public function __clone() {
        _doing_it_wrong(__FUNCTION__, 'Singleton object -> we do not want it to be cloned');
    }

    // singletons should not be restorable from strings.
    final public function __wakeup() {
        _doing_it_wrong(__FUNCTION__, 'Unserializing instances of this class is forbidden');
    }

    // This is the static method that controls the access to the singleton
    // instance. On the first run, it creates a singleton object and places it
    // into the static property. On subsequent runs, it returns the client existing
    // object stored in the static field.

    // This implementation lets you subclass the zukit_Singleton class while keeping
    // just one instance of each subclass around.
    final public static function instance($params = null) {
        $calledClass = static::class;
        if(!isset(self::$instances[$calledClass])) {
            self::$instances[$calledClass] = new $calledClass($params);
        }
        return self::$instances[$calledClass];
    }

    protected function config_singleton($params) {}
    protected function construct_more() {}

    // Basic error handling ---------------------------------------------------]

    public function log_error($error, $context = null) {
        $log = PHP_EOL.'* * * without context';
        if(is_string($context)) $log = PHP_EOL.'* * * '.$context;
		else if(!empty($context)) $log = preg_replace(
            '/\)/', '',
            preg_replace(
                '/array\s*\(/i', '',
                preg_replace(
                    '/(?<!=>)\s+?\'/', PHP_EOL.'* * * \'',
                    preg_replace(
                        '/,/', '',
                        var_export($context, true)
                    )
                )
            )
        );
        $log .= PHP_EOL.var_export($error, true);
		error_log($log);
	}

    // Scripts management -----------------------------------------------------]

    protected function get_zukit_filepath($is_style, $file, $absolute_marker = true) {
        $dir = dirname(self::$zukit_file).'/dist';
		$filename = sprintf($is_style ? '%2$s/%1$s.css' : '%2$s/%1$s.min.js', $file, $dir);
		return $absolute_marker ? ('!'.$filename) : $filename;
	}

    public function get_filepath($is_style, $is_frontend, $file, $without_dir = false) {
        $dir = $is_frontend ? ($is_style ? 'css' : 'js') : ($is_style ? 'admin/css' : 'admin/js');
		$filename = sprintf($is_style ? '/%2$s/%1$s.css' : '/%2$s/%1$s.min.js', $file, $dir);
		return $without_dir ? $filename : ($this->dir.$filename);
	}

    public function get_version($filename = '') {
    	if($this->debug) return $this->filename_version($filename);
    	return $this->version;
    }

    public function enqueue_style($file, $params = []) {
        return $this->style_or_script(true, true, array_merge($params, ['file' => $file]));
	}
    public function enqueue_script($file, $params = []) {
		return $this->style_or_script(false, true, array_merge($params, ['file' => $file]));
	}

	public function admin_enqueue_style($file, $params = []) {
		return $this->style_or_script(true, false, array_merge($params, ['file' => $file]));
	}
    public function admin_enqueue_script($file, $params = []) {
		return $this->style_or_script(false, false, array_merge($params, ['file' => $file]));
	}

    public function register_only($is_style, $is_frontend, $params) {
        $handle = $this->style_or_script($is_style, $is_frontend, array_merge($params, ['register_only' => true]));
        return $handle;
    }

    public function enqueue_only($is_style = null, $handle = null) {
        $handle = is_null($handle) ? $this->create_handle() : $handle;
        // if $is_style is null - then enqueue both (style and script)
        if($is_style === true || $is_style === null) wp_enqueue_style($handle);
        if($is_style === false || $is_style === null) wp_enqueue_script($handle);
    }

    protected function create_handle($file = null) {
        if(is_null($file)) $file = $this->prefix;
        $info = explode('.', pathinfo($file)['filename']);
        return $info[0];
    }

    private function style_or_script($is_style, $is_frontend, $params) {

        $params = array_merge([
            'file'          => null,
            'deps'          => [],
            'handle'        => null,
            'bottom'        => true,
            'data'          => null,
            'register_only' => false,
            'media'         => 'all',
		], $params);

        extract($params, EXTR_OVERWRITE);

        if(is_null($handle)) $handle = $this->create_handle($file);
        if(is_null($file)) $file = $this->prefix;

        // if we use absolute path then $file should start with '!'
        $is_absolute = substr($file, 0, 1) === '!';
        $file = str_replace('!', '', $file);

        extract($this->get_filepath_and_src($is_absolute, $is_style, $is_frontend, $file), EXTR_OVERWRITE);

// _dbug(static::class, $is_absolute, $handle, $register_only, $data, $filepath, $src, $deps, $bottom);

		if(file_exists($filepath)) {
			$version = $this->get_version($filepath);
            if($register_only) {
                if($is_style) wp_register_style($handle, $src, $deps, $version, $media);
    			else wp_register_script($handle, $src, $deps, $version, $bottom);
            } else {
                if($is_style) wp_enqueue_style($handle, $src, $deps, $version, $media);
    			else wp_enqueue_script($handle, $src, $deps, $version, $bottom);
            }

            // by wrapping our $data values inside an inner array we prevent integer and boolean values to be interpreted as strings
            // https://wpbeaches.com/using-wp_localize_script-and-jquery-values-including-strings-booleans-and-integers/
            if(!$is_style && !empty($data)) {
                $jsdata_name = $data['jsdata_name'] ?? $this->prefix.'_jsdata';
                if(isset($data['jsdata_name'])) unset($data['jsdata_name']);
                wp_localize_script($handle, $jsdata_name, ['data' => $data]);
            }

		} else {
            $this->log_error([
                'is_style'      => $is_style,
                'is_frontend'   => $is_frontend,
                'is_absolute'   => $is_absolute,
                '$params'       => $params,
                '$file'         => $file,
                '$filepath'     => $filepath,
                '$src'          => $src,
                '$handle'       => $handle,

                'prefix'        => $this->prefix,
                'dir'           => $this->dir,
            ], ['enqueue_style_or_script' => 'No file found to enqueue!']);
        }
		return $handle;
	}

    private function get_filepath_and_src($is_absolute, $is_style, $is_frontend, $file) {

        $filepath = $src = null;
        if($is_absolute) {
            $filename = str_replace($this->dir, '', $file);
            if($file === 'zukit') {
                $filepath = $this->get_zukit_filepath($is_style, $file, false);
                $src = plugin_dir_url(self::$zukit_file).str_replace(plugin_dir_path(self::$zukit_file), '', $filepath);
            }
        } else {
            $filename = $this->get_filepath($is_style, $is_frontend, $file, true);
        }

        $filepath = empty($filepath) ? $this->dir.$filename : $filepath;
        $src = empty($src) ? $this->uri.$filename : $src;

        return [
            'filepath'  => $filepath,
            'src'       => $src,
        ];
    }

    private function filename_version($filename) {
    	if(file_exists($filename)) return filemtime($filename);
    	return sprintf('%s', time());
    }
}
