<!DOCTYPE HTML>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>eSeN jsLinq (API) documentation</title>
	<link rel="stylesheet" href="http://code.jquery.com/mobile/1.4.2/jquery.mobile-1.4.2.min.css" />
    <link rel="stylesheet" href="assets/css/main.css" />
	<script src="http://code.jquery.com/jquery-1.10.2.min.js" type="text/javascript"></script>
	<script src="http://code.jquery.com/mobile/1.4.2/jquery.mobile-1.4.2.min.js" type="text/javascript"></script>
    <script type="text/javascript">
        var fidl = '<iframe width="100%" height="80%" src="[URL]/embedded/js,result" allowfullscreen frameborder="0"></iframe>';

        var navContent = function (url) {
            $("#content").html(fidl.replace("[URL]", url));
            document.location.href = "#content";
        };

        var fidlSelect = "http://jsfiddle.net/W94xY";
        var fidlWhere = "http://jsfiddle.net/W94xY/1";
        var fidlJoin = "http://jsfiddle.net/W94xY/3";
    </script>
</head>

<body>

	<div data-role="page">
    
        <div data-role="header" data-position="fixed">
            <h1>eSeN jsLinq (API) documentation</h1>
        </div>
    
        <div data-role="content">
            <ul id="nav" data-role="listview" data-inset="true">
            	<li><a href="#content" onclick="javascript:navContent(fidlSelect);">Select</a></li>
                <li><a href="#content" onclick="javascript:navContent(fidlWhere);">Where</a></li>
                <li><a href="#content" onclick="javascript:navContent(fidlJoin);">Join</a></li>
            </ul>

            <div id="content" data-role="content" style="height:80%;">
                <iframe width="100%" height="80%" src="http://jsfiddle.net/W94xY/embedded/js,result" allowfullscreen frameborder="0"></iframe>
            </div>
        </div>
    
        <div data-role="footer" data-position="fixed">
            <h6>Copyright (c) 2011-2014 Slavko Novak <slavko.novak.esen@gmail.com></h6>
        </div>
    </div>

</body>
</html>