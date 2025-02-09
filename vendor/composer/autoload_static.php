<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit335650c1c20d041f85fcd2ded42072be
{
    public static $prefixLengthsPsr4 = array (
        'R' => 
        array (
            'Roots\\Bedrock\\' => 14,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Roots\\Bedrock\\' => 
        array (
            0 => __DIR__ . '/..' . '/roots/multisite-url-fixer/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit335650c1c20d041f85fcd2ded42072be::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit335650c1c20d041f85fcd2ded42072be::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit335650c1c20d041f85fcd2ded42072be::$classMap;

        }, null, ClassLoader::class);
    }
}
