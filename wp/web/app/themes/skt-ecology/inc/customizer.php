<?php
/**
 * SKT Ecology Theme Customizer
 *
 * @package SKT Ecology
 */
 
function skt_ecology_custom_header_setup() {
	add_theme_support( 'custom-header', apply_filters( 'skt_ecology_custom_header_args', array(
		'default-text-color'     => '949494',
		'width'                  => 1600,
		'height'                 => 230,
		'wp-head-callback'       => 'skt_ecology_header_style',
 		'default-text-color' => false,
 		'header-text' => false,
	) ) );
}
add_action( 'after_setup_theme', 'skt_ecology_custom_header_setup' );
if ( ! function_exists( 'skt_ecology_header_style' ) ) :
/**
 * Styles the header image and text displayed on the blog
 *
 * @see skt_ecology_custom_header_setup().
 */
function skt_ecology_header_style() {
	?>    
	<style type="text/css">
	<?php
		//Check if user has defined any header image.
		if ( get_header_image() ) :
	?>
		.header {
			background: url(<?php echo esc_url(get_header_image()); ?>) no-repeat;
			background-position: center top;
			background-size:cover;
		}
	<?php endif; ?>	
	</style>
	<?php
}
endif; // skt_ecology_header_style 

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */ 
/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
 
function skt_ecology_customize_register( $wp_customize ) {
	//Add a class for titles
    class skt_ecology_Info extends WP_Customize_Control {
        public $type = 'info';
        public $label = '';
        public function render_content() {
        ?>
			<h3 style="text-decoration: underline; color: #DA4141; text-transform: uppercase;"><?php echo esc_html( $this->label ); ?></h3>
        <?php
        }
    }
	$wp_customize->get_setting( 'blogname' )->transport         = 'postMessage';
	$wp_customize->get_setting( 'blogdescription' )->transport  = 'postMessage';
	$wp_customize->add_setting('color_scheme',array(
			'default'	=> '#000000',
			'sanitize_callback'	=> 'sanitize_hex_color'
	));
	$wp_customize->add_control(
		new WP_Customize_Color_Control($wp_customize,'color_scheme',array(
			'label' => esc_html__('Color Scheme','skt-ecology'),			
			'section' => 'colors',
			'settings' => 'color_scheme'
		))
	);
	
	$wp_customize->add_setting('logo_bg_color',array(
			'default'	=> '#ffffff',
			'sanitize_callback'	=> 'sanitize_hex_color'
	));
	$wp_customize->add_control(
		new WP_Customize_Color_Control($wp_customize,'logo_bg_color',array(
			'label' => esc_html__('Logo Background Color','skt-ecology'),				
			'section' => 'colors',
			'settings' => 'logo_bg_color'
		))
	);		
	$wp_customize->add_setting('header_bg_color',array(
			'default'	=> '#EBC442',
			'sanitize_callback'	=> 'sanitize_hex_color'
	));
	$wp_customize->add_control(
		new WP_Customize_Color_Control($wp_customize,'header_bg_color',array(
			'label' => esc_html__('Heder Background Color','skt-ecology'),				
			'section' => 'colors',
			'settings' => 'header_bg_color'
		))
	);
	
		$wp_customize->add_setting('footer_bg_color',array(
			'default'	=> '#181818',
			'sanitize_callback'	=> 'sanitize_hex_color'
	));
	$wp_customize->add_control(
		new WP_Customize_Color_Control($wp_customize,'footer_bg_color',array(
			'label' => esc_html__('Footer Background Color','skt-ecology'),				
			'section' => 'colors',
			'settings' => 'footer_bg_color'
		))
	);	

		$wp_customize->add_setting('footer_text_color',array(
			'default'	=> '#ffffff',
			'sanitize_callback'	=> 'sanitize_hex_color'
	));
	$wp_customize->add_control(
		new WP_Customize_Color_Control($wp_customize,'footer_text_color',array(
			'label' => esc_html__('Footer Text Color','skt-ecology'),				
			'section' => 'colors',
			'settings' => 'footer_text_color'
		))
	);	
	
	$wp_customize->add_section('header_button_bar',array(
			'title'	=> esc_html__('Header Button','skt-ecology'),					
			'priority'		=> null
	));
	
	$wp_customize->add_setting('header_buttontext',array(
			'default'	=> null,
			'sanitize_callback'	=> 'sanitize_text_field'	
	));
	
	$wp_customize->add_control('header_buttontext',array(
			'label'	=> esc_html__('Add Button Name','skt-ecology'),
			'section'	=> 'header_button_bar',
			'setting'	=> 'header_buttontext'
	));	
	
	$wp_customize->add_setting('header_buttonurl',array(
			'default'	=> null,
			'sanitize_callback'	=> 'esc_url_raw'	
	));
	
	$wp_customize->add_control('header_buttonurl',array(
			'label'	=> esc_html__('Add Button Link','skt-ecology'),
			'section'	=> 'header_button_bar',
			'setting'	=> 'header_buttonurl'
	));		

	// Hide Header Button
	$wp_customize->add_setting('hide_header_button',array(
			'sanitize_callback' => 'skt_ecology_sanitize_checkbox',
			'default' => true,
	));	 
	$wp_customize->add_control( 'hide_header_button', array(
    	   'section'   => 'header_button_bar',    	 
		   'label'	=> esc_html__('Uncheck To Show This Button In Header','skt-ecology'),
    	   'type'      => 'checkbox'
     )); 	
	 // Hide Header Button	
	
	// Transparent Header
	$wp_customize->add_section('header_transparent',array(
			'title'	=> esc_html__('Homepage Header Transparent','skt-ecology'),					
			'priority'		=> null
	));	

	$wp_customize->add_setting('one_header_transparent',array(
			'sanitize_callback' => 'skt_ecology_sanitize_checkbox',
			'default' => true,
	));	 
	$wp_customize->add_control( 'one_header_transparent', array(
    	   'section'   => 'header_transparent',    	 
		   'label'	=> esc_html__('Uncheck To Enable Transparent Header','skt-ecology'),
    	   'type'      => 'checkbox'
     ));	
	 // Transparent Header
	 
	// Transparent Header Inner Page Post
	$wp_customize->add_section('header_transparent_inner',array(
			'title'	=> esc_html__('Category / Archive, Inner Page & Single Post Header Transparent','skt-ecology'),					
			'priority'		=> null
	));	

	$wp_customize->add_setting('option_inner_header_transparent',array(
			'sanitize_callback' => 'skt_ecology_sanitize_checkbox',
			'default' => true,
	));	 
	$wp_customize->add_control( 'option_inner_header_transparent', array(
    	   'section'   => 'header_transparent_inner',    	 
		   'label'	=> esc_html__('Uncheck To Enable Transparent Header','skt-ecology'),
    	   'type'      => 'checkbox'
     ));	
	 // Transparent Header Inner Page Post	 
	 
	// Inner Page Banner Settings
	$wp_customize->add_section('inner_page_banner',array(
			'title'	=> esc_html__('Inner Page Banner Settings','skt-ecology'),					
			'priority'		=> null
	));	
	
	$wp_customize->add_setting('inner_page_banner_thumb',array(
			'default'	=> null,
			'sanitize_callback'	=> 'esc_url_raw'	
	));
	
	$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'inner_page_banner_thumb', array(
        'section' => 'inner_page_banner',
		'label'	=> esc_html__('Upload Default Banner Image','skt-ecology'),
        'settings' => 'inner_page_banner_thumb',
        'button_labels' => array(// All These labels are optional
                    'select' => 'Select Image',
                    'remove' => 'Remove Image',
                    'change' => 'Change Image',
                    )
    )));

	$wp_customize->add_setting('inner_page_banner_option',array(
			'sanitize_callback' => 'skt_ecology_sanitize_checkbox',
			'default' => true,
	));	 
	$wp_customize->add_control( 'inner_page_banner_option', array(
    	   'section'   => 'inner_page_banner',    	 
		   'label'	=> esc_html__('Uncheck To Show Inner Page Banner On All Inner Pages. For Display Different Banner Image On Each Page Set Page Featured Image. Set Image Size (1400 X 538) For Better Resolution.','skt-ecology'),
    	   'type'      => 'checkbox'
     ));	
	 // Inner Page Banner Settings
	 
	 
	// Inner Post Banner Settings
	$wp_customize->add_section('inner_post_banner',array(
			'title'	=> esc_html__('Category / Archive And Single Post Banner Settings','skt-ecology'),					
			'priority'		=> null
	));	
	
	$wp_customize->add_setting('inner_post_banner_thumb',array(
			'default'	=> null,
			'sanitize_callback'	=> 'esc_url_raw'	
	));
	
	$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'inner_post_banner_thumb', array(
        'section' => 'inner_post_banner',
		'label'	=> esc_html__('Upload Default Banner Image','skt-ecology'),
        'settings' => 'inner_post_banner_thumb',
        'button_labels' => array(// All These labels are optional
                    'select' => 'Select Image',
                    'remove' => 'Remove Image',
                    'change' => 'Change Image',
                    )
    )));

	$wp_customize->add_setting('inner_post_banner_option',array(
			'sanitize_callback' => 'skt_ecology_sanitize_checkbox',
			'default' => true,
	));	 
	$wp_customize->add_control( 'inner_post_banner_option', array(
    	   'section'   => 'inner_post_banner',    	 
		   'label'	=> esc_html__('Uncheck To Show Inner Post Banner On Category / Archive And Single Post. For Display Different Banner Image On Each Post Set Post Featured Image. Set Image Size (1400 X 538) For Better Resolution.','skt-ecology'),
    	   'type'      => 'checkbox'
     ));	
	 // Inner Page Banner Settings	 

	$wp_customize->add_section('footer_text_copyright',array(
			'title'	=> esc_html__('Footer Copyright Text','skt-ecology'),				
			'priority'		=> null
	));
	
	$wp_customize->add_setting('footer_text',array(
			'default'	=> null,
			'sanitize_callback'	=> 'sanitize_text_field'	
	));
	$wp_customize->add_control('footer_text',array(
			'label'	=> esc_html__('Add Copyright Text Here','skt-ecology'),
			'section'	=> 'footer_text_copyright',
			'setting'	=> 'footer_text'
	));		 
}
add_action( 'customize_register', 'skt_ecology_customize_register' );
//Integer
function skt_ecology_sanitize_integer( $input ) {
    if( is_numeric( $input ) ) {
        return intval( $input );
    }
}
function skt_ecology_sanitize_checkbox( $checked ) {
	// Boolean check.
	return ( ( isset( $checked ) && true == $checked ) ? true : false );
}

//setting inline css.
function skt_ecology_custom_css() {
    wp_enqueue_style(
        'skt-ecology-custom-style',
        get_template_directory_uri() . '/css/skt-ecology-custom-style.css' 
    );
        $color = esc_html(get_theme_mod( 'color_scheme' ));
		$headerbgcolor = esc_html(get_theme_mod( 'header_bg_color' )); 
		$footerbgcolor = esc_html(get_theme_mod( 'footer_bg_color' ));
		$footertextcolor = esc_html(get_theme_mod( 'footer_text_color' )); 
		$logobgcolor = esc_html(get_theme_mod('logo_bg_color')); 

        $custom_css = "
					#sidebar ul li a:hover,
					.blog_lists h4 a:hover,
					.recent-post h6 a:hover,
					.recent-post a:hover,
					.design-by a,
					.postmeta a:hover,
					.tagcloud a,
					.blocksbox:hover h3,
					.rdmore a,
					.main-navigation ul li:hover a, .main-navigation ul li a:focus, .main-navigation ul li a:hover, .main-navigation ul li.current-menu-item a, .main-navigation ul li.current_page_item a
					{ 
						 color: {$color} !important;
					}

					.pagination .nav-links span.current, .pagination .nav-links a:hover,
					#commentform input#submit:hover,
					.wpcf7 input[type='submit'],
					input.search-submit,
					.recent-post .morebtn:hover, 
					.read-more-btn,
					.woocommerce-product-search button[type='submit'],
					.head-info-area,
					.designs-thumb,
					.hometwo-block-button,
					.aboutmore,
					.service-thumb-box,
					.view-all-btn a:hover
					{ 
					   background-color: {$color} !important;
					}

					.titleborder span:after{border-bottom-color: {$color} !important;}
					.header{background-color: {$headerbgcolor};}
					#footer{background-color: {$footerbgcolor};}
					.copyright-wrapper{color: {$footertextcolor} !important;}					
					.logo, .logo:before{background-color: {$logobgcolor} !important;}
				";
        wp_add_inline_style( 'skt-ecology-custom-style', $custom_css );
}
add_action( 'wp_enqueue_scripts', 'skt_ecology_custom_css' );          
/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
function skt_ecology_customize_preview_js() {
	wp_enqueue_script( 'skt_ecology_customizer', get_template_directory_uri() . '/js/customize-preview.js', array( 'customize-preview' ), '20130508', true );
}
add_action( 'customize_preview_init', 'skt_ecology_customize_preview_js' );