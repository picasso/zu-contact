<?php
//	
// REPEATER TEMPLATE 	
// 
// These template variables available for repeater	
// 
// $_item_num - current number starting from 1
// $_item_type - item post type
// $_classes - item classes (odd, even etc.)
// $_post_id - Post ID
// $_image_item - responsive thumbnail
// $_link - item link
// $_thumbnails - array of thumbnails for current item

	$image = empty($_thumbnails) ? '' : sprintf('<img src="%1$s" data-post_id="%2$s" />',  $_thumbnails['768'], $_post_id);
	$heading = sprintf('<h2><a href="%1$s" data-post_id="%2$s">%3$s</a></h2>', $_link, $_post_id, get_the_title($_post_id));
	$excerpt = zu()->get_excerpt($_post_id);
?>

<div class="zu-row zu-odd_even_item <?php echo $_classes; ?>">
	<div class="zu-column zu-column_1_3">
		<div class="zu-block zu-bg_layout_light zu-text_align_right zu-thumbnail">
			<?php echo $image; ?>
		</div> <!-- .zu-block -->
	</div> <!-- .zu-column -->
	<div class="zu-column zu-column_2_3">
		<div class="zu-block zu-bg_layout_light zu-text_align_left">
			<?php echo $heading; ?>
			<div class="tw_top_30"><?php echo $excerpt; ?></div>
		</div> <!-- .zu-block -->
	</div> <!-- .zu-column -->
</div> <!-- .zu-row -->
