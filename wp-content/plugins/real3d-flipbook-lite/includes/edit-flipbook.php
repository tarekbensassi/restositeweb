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
      <form method="post" id="real3dflipbook-options-form" enctype="multipart/form-data" action="admin-ajax.php?page=real3d_flipbook_admin&action=save_settings&bookId=<?php echo($current_id);?>">
         <h1><span id="edit-flipbook-text"></span></h1>
         <div id="titlediv">
            <div id="titlewrap">
               <input type="text" name="name" size="30" value="" id="title" spellcheck="true" autocomplete="off" placeholder="Enter title here">
            </div>
         </div>

         <div style="background-color: rgb(222, 222, 222); padding: 10px; margin: 10px 0px;"><div>This is Real3D Flipbook Lite. Get <a href="http://creativeinteractivemedia.com/real3d/">Real3D Flipbook PRO</a> to enable more features - PDF links, PDF search, Thumbnails, Table of Content, Share, Print, Download, Lightbox (popup) flipbook, Fullscreen, Mobile settings, Customize UI, custom Logo, custom HTML on pages, Deeplinking, RTL and more.</div></div>


         <div>
            <h2 id="r3d-tabs" class="nav-tab-wrapper wp-clearfix">
               <a href="#" class="nav-tab" data-tab="tab-pages">Pages</a>
               <a href="#" class="nav-tab" data-tab="tab-general">General</a>
            </h2>

            <div id="tab-pages" style="display:none;">
               <h4>Add pages to flipbook. Source can be PDF or images.</h4>
               <br/>
               <h3>PDF Flipbook</h3>
               <p class="description" id="">Create flipbook from PDF. Select a PDF file or enter PDF file URL. (PDF needs to be on the same domain.)</p>
               <a class="add-pdf-pages-button button-primary" href="#">Select PDF</a><input type="text" class="regular-text" name="pdfUrl" value="" placeholder="PDF url"><button type="button" class="button-secondary preview-pdf-pages">Preview PDF pages</button>
               <br/>
               <br/>
               <h3>JPG Flipbook</h3>
               <p class="description" id="">Create flipbook from images. Select images to use as flipbook pages. Multiple file upload is enabled. </p>
               <a class="add-jpg-pages-button button-primary" href="#">Select images</a><br/><br/>

               <!-- <h3>PDF to JPG Flipbook (beta)</h3>
               <p class="description" id="">Convert PDF to images, save images to server (to wp-content/uploads/real3dflipbook/{bookName}) and create JPG Flipbook.</p>
               <a class="pdf-to-jpg-button button-primary" href="#">Select PDF</a>
               -->
               <p class="pdf-to-jpg-info"></p>
               <table  style="" class="form-table" id="flipbook-pdf-options">
                  <tbody></tbody>
               </table>
               <div>
                  <!-- <h2 style="display:none;">Select flipbook type</h2> -->
                  <p style="display:none;">
                     <label>
                     <input id="flipbook-type-pdf" name="type" type="radio" value="pdf"> PDF     
                     </label>
                  </p>
                  <p style="display:none;">
                     <label>
                     <input id="flipbook-type-jpg" name="type" type="radio" value="jpg"> JPG     
                     </label>
                  </p>
                  <div  style="display:none;" class="clear" ></div>
                  <div id="select-pdf">
                     <h2></h2>
                     <table  style="display:none;" class="form-table" id="flipbook-pdf-options">
                        <tbody></tbody>
                     </table>
                     <h3 style="display:none;">Pages </h3>
                     <div class="attachments-browser">
                        <ul id="pages-container" tab
                           index="-1" class="attachments ui-sortable">
                        </ul>
                        <div class="delete-pages-button">Delete all pages</div>
                     </div>
                  </div>
               </div>
               <div id="convert-pdf" style="display:none;">PDF
                  <a href="#" class="add-new-h2 select-pdf-button">Select</a>
               </div>
            </div>

            <div id="tab-general" style="display:none;">
               <table class="form-table" id="flipbook-general-options">
                  <tbody></tbody>
               </table>
            </div>

         </div>
   </div>
   <p id="r3d-save" class="submit">
   <span class="spinner"></span>

   <input type="submit" name="btbsubmit" id="btbsubmit" class="alignright button save-button button-primary" value="Update" style="display:none;">
   <input type="submit" name="btbsubmit" id="btbsubmit" class="alignright button create-button button-primary" value="Publish" style="display:none;">
   <a id="r3d-preview" href="#" class="alignright flipbook-preview button save-button button-secondary">Preview</a>
   <a href="#" class="alignright flipbook-reset-defaults button button-secondary">Reset all settings</a>
   </p>
   <div id="r3d-save-holder" style="display: none;" />
   </form>
   </div>
</div>
<?php 
wp_enqueue_media();
add_thickbox(); 

wp_enqueue_script( "real3d-flipbook-iscroll" ); 
wp_enqueue_script( "real3d-flipbook-pdfjs" ); 
wp_enqueue_script( "real3d-flipbook-pdfworkerjs" ); 
wp_enqueue_script( "real3d-flipbook-pdfservice" ); 
wp_enqueue_script( "real3d-flipbook-threejs" ); 
wp_enqueue_script( "real3d-flipbook-book3" );
wp_enqueue_script( "real3d-flipbook-bookswipe" );
wp_enqueue_script( "real3d-flipbook-webgl" );
wp_enqueue_script( "real3d_flipbook" );
wp_enqueue_style( 'real3d-flipbook-style' ); 
wp_enqueue_style( 'real3d-flipbook-font-awesome' ); 

wp_enqueue_script( 'alpha-color-picker' );
wp_enqueue_script( "real3d-flipbook-admin" ); 
wp_enqueue_style( 'alpha-color-picker' );
wp_enqueue_style( 'real3d-flipbook-admin-css' ); 

$ajax_nonce = wp_create_nonce( "saving-real3d-flipbook");
$flipbooks[$current_id]['security'] = $ajax_nonce;
$flipbook_global = get_option("real3dflipbook_global");

$flipbook_global_defaults = r3dfb_getDefaults();

$flipbooks[$current_id]['globals'] = array_merge($flipbook_global_defaults, $flipbook_global);
wp_localize_script( 'real3d-flipbook-admin', 'flipbook', json_encode($flipbooks[$current_id]) );