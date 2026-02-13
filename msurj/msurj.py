import os
import re

template = """
<!DOCTYPE html>
<link rel="stylesheet" href="msurj.css">
<html>
  <head>
    <title>The Abstract</title>
    <meta charset="utf-8" name="viewport" content="width = 1050, user-scalable = no"/>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://apis.google.com/js/api.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js"></script>
    <script src="lib/modernizr.2.5.3.min.js"></script>
    <script src="lib/turn.html4.min.js"></script>
    <script src="lib/turn.js"></script>
    <script src="msurj.js"></script>
  </head>
<body>
<div class="flipbook-viewport">
	<div class="container">
		<div class="flipbook">
		</div>
	</div>
</div>
</body>
</html>
"""

for folder in os.scandir('../msurj/pages'):
    if folder.is_dir() and bool(re.search('\d{4}', folder.name)):
        html = open(f'{folder.name}.html', 'w')
        html.write(template)
        html.close()