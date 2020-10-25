<?php
//	
// REPEATER TEMPLATE 	
// 
// These template variables available for repeater	
// 
// $_template - name of template
// $_classes - item classes (odd, even etc.)
// $_was_sent - status of form
// $_message - form message
// $_values - form values which were sent to repeater
// $_errors - form errors if any

	
	cplus_print_form($_template, $_values, $_errors, $_message, $_classes);
