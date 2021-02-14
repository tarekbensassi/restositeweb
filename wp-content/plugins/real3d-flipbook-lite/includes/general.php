<?php 
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}
?>
<div class='wrap'>
   <div id='real3dflipbook-admin' style="display:none;">
      <a href="admin.php?page=real3d_flipbook_admin" class="back-to-list-link">&larr; 
      <?php _e('Back to flipbooks list', 'flipbook'); ?>
      </a>
      <h1>Global Settings</h1>
      <p>Global default settings for all flipbooks.</p>
      <form method="post" id="real3dflipbook-options-form" enctype="multipart/form-data" action="admin-ajax.php?page=real3d_flipbook_admin&action=save_settings">
         <div>
            <h2 id="r3d-tabs" class="nav-tab-wrapper wp-clearfix">
               <a href="#" class="nav-tab" data-tab="tab-general">General</a>
            </h2>
         </div>
         <div class="">
            <div id="tab-general" style="display:none;">
               <table class="form-table" id="flipbook-general-options">
                  <tbody></tbody>
               </table>
            </div>
         </div>
   </div>
   <p id="r3d-save" class="submit">
   <span class="spinner"></span>
   <!-- <a class="update-all-flipbooks alignright" href='#'>Save this settings for all flipbooks</a> --> 
   <input type="submit" name="btbsubmit" id="btbsubmit" class="alignright button save-button button-primary" value="Save">
   <a href="#" class="alignright flipbook-reset-defaults button button-secondary">Reset to defaults</a>
   </p>
   <div id="r3d-save-holder" style="display: none;" />
   </form>
   </div>
</div>
<?php 

wp_enqueue_media();
// add_thickbox(); 
wp_enqueue_style( 'real3d-flipbook-font-awesome'); 
wp_enqueue_script( 'alpha-color-picker');
wp_enqueue_style( 'alpha-color-picker');
wp_enqueue_script( "real3d-flipbook-settings"); 
wp_enqueue_style( 'real3d-flipbook-admin-css'); 

$flipbook_global = get_option( "real3dflipbook_global" );

$flipbook_global_defaults = r3dfb_getDefaults();

$flipbook = array_merge($flipbook_global_defaults, $flipbook_global);

$r3d_nonce = wp_create_nonce( "r3d_nonce");
wp_localize_script( 'real3d-flipbook-settings', 'r3d_nonce', $r3d_nonce );

$flipbook["globals"] = $flipbook_global;
$flipbook["globals_defaults"] = $flipbook_global_defaults;
wp_localize_script( 'real3d-flipbook-settings', 'options', json_encode($flipbook) );