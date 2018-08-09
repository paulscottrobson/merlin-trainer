# ****************************************************************************************
# ****************************************************************************************
#
#		Name:		testsongs.py
#		Purpose:	Converting tunes in Merlin book.
#		Date:		9th August 2018
#		Author:		Paul Robson (paul@robsons.org.uk)
#
# ****************************************************************************************
# ****************************************************************************************

from music import *

tunes = {}

print("=========================")
tunes["oldMacDonald"] = Tune(4,100,"""
			0 0 0 X0 | X1 X1 X0o | 2 2 1 1 | 0oo X0 | 0 0 0 X0 | X1 X1 X0o | 2 2 1 1 | 0ooo""")

print("=========================")
tunes["twinkleTwinkle"] = Tune(4,100,"""
			0 0 4 4 | 5 5 4o | 3 3 2 2 | 1 1 0o | 4 4 3 3 | 2 2 1o | 4 4 3 3 |2 2 1o
			0 0 4 4 | 5 5 4o | 3 3 2 2 | 1 1 0o""")


print("=========================")
tunes["happyBirthday"] = Tune(3,100,"""
			& & X0- X0- | X1 X0 0 | X2o X0- X0- | X1 X0 1 | 0o X0- X0- | 4 2 0 | X2 X1 3- 3- | 2 0 1 | 0oo""")

print("=========================")
tunes["jingleBells"] = Tune(4,100,"""
			2 2 2o | 2 2 2o | 2 4 0. 1- | 2ooo 
			3 3 3. 3- | 3 2 2 2- 2- | 2 1 1 2
			1o 4o | 2 2 2o | 2 2 2o
			2 4 0. 1- | 2ooo | 3 3 3. 3- 
			3 2 2 2- 2- | 4 4 3 1 | 0ooo """)

print("=========================")
tunes["woolFromTheSheep"] = Tune(3,100,"""
			& & XX2 | X1- X0- X1 X2 | 0o 0 | X2- 0- 1 X2
			0 X1 XX2 | X1- X0- 1 2 | 0o 2
			2- 1- 0 X2 | X1o 2 | X2o 2 
			0o 2 | 2- 1- 0 X2 | 0 X1 2
			X2o 2 | 0o 2 | 2- 1- 0 X2 | X1oo""")


print("=========================")
tunes["marianneMill"] = Tune(3,100,"""
			& & &- X0- | 0 0- 0 1- | 2 2- 0 2- | 4 4- 3 3-
			4 3- 2 X0- | 0 0- 0 1- | 2 2- 0 2-
			4 4- 3 3- | 4 3- 2 2- | 2 2- 2 2-
			4. 3 2-  | 1 1- 1 1- |3. 2 1- | 0 0- x0 0- 
			2- 2- 2- 0. |4. 3 2- | 1 1- 0. """)

links = " \n".join(['   <a href="index.html?{1}">{0}</a>'.format(x,tunes[x].getRender()) for x in tunes.keys()])
#		<a href="index.html?beats=4&tempo=100&music=0XXe0XXe0XXe0XXe-1XXe1XXe0">xxx</a><a 


htmlSource = """
<!DOCTYPE html>
<html>
<head>
    <style type="text/css">
        body{
            background: #e97312;
            padding:0px;
            margin:0px;
        }
        a {
        	color:blue;
        	font-size: 100%;
        	margin-right:20px
        }
        </style>
        <script src="lib/phaser.min.js"></script>
        <script src = "build/game.js"></script>
</head>
<body>
<<links>>
</body>
</html>		
""".replace("<<links>>",links)

h = open("index.html","w").write(htmlSource)
