<?php 
    if ( ! defined( 'ABSPATH' ) ) {
        exit; // Exit if accessed directly
    }
?>
<div class="wrap">

	<h2>Flipbooks
		<a href='<?php echo $url .'&action=add_new'; ?>' class='add-new-h2'>Add New</a>
	</h2>
			
	<div class="tablenav top">
		<div class="alignleft actions bulkactions">
			<label for="bulk-action-selector-top" class="screen-reader-text">Select bulk action</label>
			<select name="action" id="bulk-action-selector-top">
				<option value="-1" selected="selected">Bulk Actions</option>
				<option value="trash">Trash</option>
			</select>

			<input type="submit" id="doaction" class="button action bulkactions-apply" value="Apply">
		</div>


<!-- <div class="alignleft actions">

<label class="screen-reader-text" for="cat">Filter by category</label><select name="cat" id="cat" class="postform">
	<option value="0">All categories</option>
	<option class="level-0" value="1">Uncategorized</option>
</select> 
<input type="submit" name="filter_action" id="post-query-submit" class="button" value="Filter">		
</div>-->

		<div class="tablenav-pages">
	        <span class="displaying-num"></span>
			<span class="pagination-links"><a class="first-page" title="Go to the first page" href="#">«</a>
			<a class="prev-page" title="Go to the previous page" href="#">‹</a>
			<span class="paging-input"><label for="current-page-selector" class="screen-reader-text">Select Page</label><input class="current-page" id="current-page-selector" title="Current page" type="text" name="paged" value="1" size="1"> of <span class="total-pages"></span></span>
			<a class="next-page" title="Go to the next page" href="#">›</a>
			<a class="last-page" title="Go to the last page" href="#">»</a></span>
			<!-- <span class="items-20" title="View 20">View 20</span>
			<span class="items-100" title="View 100">View 100</span>
			<span class="items-all" title="View all">View all</span> -->
        </div>

	</div>	
	
	
	
	<table class='flipbooks-table wp-list-table widefat fixed striped pages'>
<thead>
			<tr>
				<th scope="col" id="cb" class="manage-column column-cb check-column" style="">
					<label class="screen-reader-text" for="cb-select-all-1">Select All</label>
					<input id="cb-select-all-1" type="checkbox">
				</th>
			
				<th tabindex="-1" scope="col" id="name" class="manage-column column-title sorted desc"><a href="#"><span>Name</span><span class="sorting-indicator"></span></a></th>
				
				<th style="width:200px">Shortcode</th>
				
				<th tabindex="-1" style="width:100px" scope="col" id="date" class="manage-column column-title sorted desc"><a href="#"><span>Date</span><span class="sorting-indicator"></span></a></th>
			</tr>
			</thead>
			<tbody id="flipbooks-table">
		</tbody>		 
	</table>
	
	<div class="tablenav bottom">
		<div class="alignleft actions bulkactions">
			<label for="bulk-action-selector-bottom" class="screen-reader-text">Select bulk action</label>
			<select name="action" id="bulk-action-selector-bottom">
				<option value="-1" selected="selected">Bulk Actions</option>
				<option value="trash">Trash</option>
			</select>

			<input type="submit" id="doaction" class="button action bulkactions-apply" value="Apply">
		</div>



<!--<div class="alignleft actions">

<label class="screen-reader-text" for="cat">Filter by category</label><select name="cat" id="cat" class="postform">
	<option value="0">All categories</option>
	<option class="level-0" value="1">Uncategorized</option>
</select>
<input type="submit" name="filter_action" id="post-query-submit" class="button" value="Filter">		</div>-->

		<div class="tablenav-pages">
			

			<span class="displaying-num"></span>
			<span class="pagination-links"><a class="first-page" title="Go to the first page" href="#">«</a>
			<a class="prev-page" title="Go to the previous page" href="#">‹</a>
			<span class="paging-input"><label for="current-page-selector" class="screen-reader-text">Select Page</label><input class="current-page" id="current-page-selector" title="Current page" type="text" name="paged" value="1" size="1"> of <span class="total-pages"></span></span>
			<a class="next-page" title="Go to the next page" href="#">›</a>
			<a class="last-page" title="Go to the last page" href="#">»</a></span>
			<!-- <span class="items-20" title="View 20">View 20</span>
			<span class="items-100" title="View 100">View 100</span>
			<span class="items-all" title="View all">View all</span> -->
		</div>
		</div>	

	<br/>
	<br/>
	<br/>
	<span class="submitbox"><a class="submitdelete delete-all-flipbooks" href='#'>Delete all flipbooks</a></span>
	
	
	<!-- <div id="copy-text-hidden" style="display: none;"></div> -->
	<!-- <div id="copy-text-hidden" style=""></div> -->
	<input type="text" id="copy-text-hidden" value="" style="opacity: 0; pointer-events: none; ">
</div>
<?php

wp_enqueue_script("real3d-flipbook-flipbooks");

$flipbooks_formatted = array();
foreach ($flipbooks as $b) {
	$book = array(	"id" => $b['id'], 
					"name" => $b['name'],
					"date" => $b['date']
				);
	array_push($flipbooks_formatted,$book);
}

$r3d_nonce = wp_create_nonce( "r3d_nonce");
wp_localize_script( 'real3d-flipbook-flipbooks', 'r3d_nonce', $r3d_nonce );

wp_localize_script( 'real3d-flipbook-flipbooks', 'flipbooks', json_encode($flipbooks_formatted) );

if (isset($_GET['action']) && $_GET['action'] == "download_json") {

	wp_localize_script( 'real3d-flipbook-flipbooks', 'flipbooks_json', json_encode($flipbooks) );

}