<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit0387b2674629ae18b73f8b1be90ee23f
{
    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
        'Ps_Currencyselector' => __DIR__ . '/../..' . '/ps_currencyselector.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->classMap = ComposerStaticInit0387b2674629ae18b73f8b1be90ee23f::$classMap;

        }, null, ClassLoader::class);
    }
}
