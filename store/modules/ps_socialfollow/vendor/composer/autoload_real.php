<?php

// autoload_real.php @generated by Composer

class ComposerAutoloaderInit88a8c8a056f7b9292a57bb6ad5f0bd69
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

        spl_autoload_register(array('ComposerAutoloaderInit88a8c8a056f7b9292a57bb6ad5f0bd69', 'loadClassLoader'), true, false);
        self::$loader = $loader = new \Composer\Autoload\ClassLoader(\dirname(__DIR__));
        spl_autoload_unregister(array('ComposerAutoloaderInit88a8c8a056f7b9292a57bb6ad5f0bd69', 'loadClassLoader'));

        require __DIR__ . '/autoload_static.php';
        call_user_func(\Composer\Autoload\ComposerStaticInit88a8c8a056f7b9292a57bb6ad5f0bd69::getInitializer($loader));

        $loader->setClassMapAuthoritative(true);
        $loader->register(false);

        return $loader;
    }
}
