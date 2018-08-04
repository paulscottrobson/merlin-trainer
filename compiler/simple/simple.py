#
#			Simple compiler for Basic Songs from Merlin Handbook
#
#	This really just generating some test data.

import re,sys

class SongCompiler(object):
	def __init__(self):
		self.songs = []

	def compile(self,title,beats,music):
		music = ("|".join(music.split("\n"))).replace("\t"," ").upper().replace("&","X")
		info = { "title":title,"beats":beats,"tempo":100 }
		tuneData = []
		for bar in music.split("|"):
			if bar.strip() != "":
				tuneData.append(self.compileBar(bar))
		info["music"] = "-".join(tuneData)
		info["qstring"] = "beats={0}&tempo={1}&music={2}".format(beats,info["tempo"],info["music"])
		self.songs.append(info)
		return info

	def compileBar(self,bar):
		elements = []
		for e in bar.split(" "):
			if e.strip() != "":
				elements.append(self.compileStrum(e.strip()))
		return "".join(elements)

	def compileStrum(self,strum):
		#print(strum)
		m = re.match("^([X0-7])+([\.\-\=O]*)$",strum)
		assert m is not None,"Strum : '"+strum+"'"
		qBeats = 4
		for c in m.group(2):
			if c == "-":
				qBeats = qBeats -2
			elif c == "=":
				qBeats = qBeats -3
			elif c == "O`":
				qBeats = qBeats + 4
			elif c == ".":
				qBeats = int(qBeats * 3 / 2)

		return (m.group(1)+"XXX")[:3]+chr(qBeats+97)


	def generateHTML(self,handle = sys.stdout):
		handle.write("""
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
		""")

		for s in self.songs:
			handle.write("<a href=\"index.html?{1}\">{0}</a>".format(s["title"],s["qstring"]))
		handle.write("""
		</body>
		</html>		
		""")




cc = SongCompiler()

oldMacDonald = cc.compile("Old MacDonald had a Farm",4,"""
			0 0 0 X0 | X1 X1 X0o | 2 2 1 1 | 0oo X0 | 0 0 0 X0 | X1 X1 X0o | 2 2 1 1 | 0ooo""")

twinkleTwinkle = cc.compile("Twinkle Twinkle little Star",4,"""
			0 0 4 4 | 5 5 4o | 3 3 2 2 | 1 1 0o | 4 4 3 3 | 2 2 1o | 4 4 3 3 |2 2 1o
			0 0 4 4 | 5 5 4o | 3 3 2 2 | 1 1 0o""")


happyBirthday = cc.compile("Happy Birthday ",3,"""
			& & X0- X0- | X1 X0 0 | X2o X0- X0- | X1 X0 1 | 0o X0- X0- | 4 2 0 | X2 X1 3- 3- | 2 0 1 | 0oo""")

jingleBells = cc.compile("Jingle Bells",4,"""
			2 2 2o | 2 2 2o | 2 4 0. 1- | 2ooo 
			3 3 3. 3- | 3 2 2 2- 2- | 2 1 1 2
			1o 4o | 2 2 2o | 2 2 2o
			2 4 0. 1- | 2ooo | 3 3 3. 3- 
			3 2 2 2- 2- | 4 4 3 1 | 0ooo """)

woolFromTheSheep = cc.compile("The Wool from the sheep",3,"""
			& & XX2 | X1- X0- X1 X2 | 0o 0 | X2- 0- 1 X2
			0 X1 XX2 | X1- X0- 1 2 | 0o 2
			2- 1- 0 X2 | X1o 2 | X2o 2 
			0o 2 | 2- 1- 0 X2 | 0 X1 2
			X2o 2 | 0o 2 | 2- 1- 0 X2 | X1ooo""")


marianneMill = cc.compile("Marianne's going to the Mill",3,"""
			& & &- X0- | 0 0- 0 1- | 2 2- 0 2- | 4 4- 3 3-
			4 3- 2 X0- | 0 0- 0 1- | 2 2- 0 2-
			4 4- 3 3- | 4 3- 2 2- | 2 2- 2 2-
			4. 3 2-  | 1 1- 1 1- |3. 2 1- | 0 0- x0 0- 
			2- 2- 2- 0. |4. 3 2- | 1 1- 0. """)

cc.generateHTML(open("..\\..\\app\\index.html","w"))