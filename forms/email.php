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

?>

<html style="background:#444">
	<head>
		
		<title>The Subject of my Email</title>
	
	</head>
	<body>
		<div id="email_container">
			<div style="width:570px; padding:0 0 0 20px; margin:50px auto 12px auto" id="email_header">
				<span style="background:#585858; color:#fff; padding:12px;font-family:trebuchet ms; letter-spacing:1px; 
					-moz-border-radius-topleft:5px; -webkit-border-top-left-radius:5px; 
					border-top-left-radius:5px;moz-border-radius-topright:5px; -webkit-border-top-right-radius:5px; 
					border-top-right-radius:5px;">
					MyAwesomeWebsite.com
				</div>
			</div>
		
		
			<div style="width:550px; padding:0 20px 20px 20px; background:#fff; margin:0 auto; border:3px #000 solid;
				moz-border-radius:5px; -webkit-border-radus:5px; border-radius:5px; color:#454545;line-height:1.5em; " id="email_content">
				
				<h1 style="padding:5px 0 0 0; font-family:georgia;font-weight:500;font-size:24px;color:#000;border-bottom:1px solid #bbb">
					The subject of this email
				</h1>
				
				<p>
					Lorem ipsum dolor sit amet, consectetuer adipiscing 
					elit. Aenean commodo ligula eget dolor. Aenean massa 
					<strong>strong</strong>. Cum sociis natoque penatibus 
					et magnis dis parturient montes, nascetur ridiculus 
					mus. Donec quam felis, ultricies nec, pellentesque 
					eu, pretium quis, sem. Nulla consequat massa quis 
					enim. Donec pede justo, fringilla vel, aliquet nec, 
					vulputate eget, arcu. In enim justo, rhoncus ut.
				</p>
				<p>
					Imperdiet a, venenatis vitae, justo. Nullam dictum 
					felis eu pede <a style="color:#bd5426" href="#">link</a> 
					mollis pretium. Integer tincidunt. Cras dapibus. 
					Vivamus elementum semper nisi. Aenean vulputate 
					eleifend tellus. Aenean leo ligula, porttitor eu, 
					consequat vitae, eleifend ac, enim. Aliquam lorem ante, 
					dapibus in, viverra quis, feugiat a, tellus. Phasellus 
					viverra nulla ut metus varius laoreet. Quisque rutrum. 
					Aenean imperdiet. Etiam ultricies nisi vel augue. 
					Curabitur ullamcorper ultricies nisi.
				</p> 
				
				<p style="">
					Warm Regards,<br>
					The MyAwesomeWebsite Editor
				</p>
				
				<div style="text-align:center; border-top:1px solid #eee;padding:5px 0 0 0;" id="email_footer"> 
					<small style="font-size:11px; color:#999; line-height:14px;">
						You have received this email because you are a member of MyAwesomeSite.com.
						If you would like to stop receiving emails from us, feel free to 
						<a href="" style="color:#666">unregister</a> from our mailing list
					</small>
				</div>
				
			</div>
		</div>
	</body>
</html>