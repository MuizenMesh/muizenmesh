<?php

// autoload_real.php @generated by Composer

class ComposerAutoloaderInit0c9e9e6c842833aa743ee2f084b7b1ae
{
    private static $loader;

    public static function loadClassLoader($class)
    {
        if ('Composer\Autoload\ClassLoader' === $class) {
            require __DIR__ . '/ClassLoader.php';
        }
    }

    /**
     * @return \Composer\Autoload\ClassLoader
     */
    public static function getLoader()
    {
        if (null !== self::$loader) {
            return self::$loader;
        }

        require __DIR__ . '/platform_check.php';

        spl_autoload_register(array('ComposerAutoloaderInit0c9e9e6c842833aa743ee2f084b7b1ae', 'loadClassLoader'), true, false);
        self::$loader = $loader = new \Composer\Autoload\ClassLoader(\dirname(__DIR__));
        spl_autoload_unregister(array('ComposerAutoloaderInit0c9e9e6c842833aa743ee2f084b7b1ae', 'loadClassLoader'));

        require __DIR__ . '/autoload_static.php';
        call_user_func(\Composer\Autoload\ComposerStaticInit0c9e9e6c842833aa743ee2f084b7b1ae::getInitializer($loader));

        $loader->setClassMapAuthoritative(true);
        $loader->register(false);

        $filesToLoad = \Composer\Autoload\ComposerStaticInit0c9e9e6c842833aa743ee2f084b7b1ae::$files;
        $requireFile = \Closure::bind(static function ($fileIdentifier, $file) {
            if (empty($GLOBALS['__composer_autoload_files'][$fileIdentifier])) {
                $GLOBALS['__composer_autoload_files'][$fileIdentifier] = true;

                require $file;
            }
        }, null, null);
        foreach ($filesToLoad as $fileIdentifier => $file) {
            $requireFile($fileIdentifier, $file);
        }

        return $loader;
    }
}
