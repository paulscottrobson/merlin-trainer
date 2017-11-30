# ***************************************************************************************
# ***************************************************************************************
#
#									Merlin Compiler
#
# ***************************************************************************************
# ***************************************************************************************

import re

# ***************************************************************************************
#
#							   Represents a single strum
#
# ***************************************************************************************
class Strum:
	def __init__(self,fretting,qbLength):
		self.loadFretting(fretting.lower() if fretting != "&" else "xxx")
		self.qbLength = qbLength
		self.mapping = [0,2,4,5,7,9,11,12]
	#
	#	Get QB Length
	#
	def getQBLength(self):
		return self.qbLength
	#
	#	Load fretting in as diatonic positions in an array. Uses 76+ format where
	#	highest string is first.
	#
	def loadFretting(self,fretting):
		self.fretting = []
		pendingBend = False
		for c in fretting:
			if c >= "0" and c <= "7":
				self.fretting.append(int(c))
			elif c == '+':
				self.fretting[-1] = self.fretting[-1]+0.5
			elif c == 'x':
				self.fretting.append(None)
			else:
				raise Exception("Bad fretting "+fretting)
		while len(self.fretting) < 3:
			self.fretting.append(None)
		assert len(self.fretting) == 3,"Fretting too long "+fretting
		self.fretting.reverse()
	#
	#	Render fretting suitable for output
	#
	def render(self):
		render = ""
		for f in self.fretting:
			code = chr(self.mapping[int(f)]+97) if f is not None else "-"
			code = code if f is None or f == int(f) else chr(ord(code) + 1)
			render = render + code
		return render + chr(self.qbLength+96)

# ***************************************************************************************
#
#						Represents a single compiled song
#
# ***************************************************************************************

class MerlinJSON:
	def __init__(self):
		self.settings = { "title":"","tempo":"100","beats":"4" }
		self.bars = []
		self.strumCount = 0
	#
	#	get beats
	#
	def getBeats(self):
		return int(self.settings["beats"])
	#
	#	set variable
	#
	def setVariable(self,key,value):
		key = key.lower().strip()
		if key not in self.settings:
			raise Exception("Unknown key "+key)
		self.settings[key] = value.lower().strip()
	#
	#	add a new bar
	#
	def addBar(self):
		self.bars.append([])
		self.qbPos = 0
	#
	#	add a strum
	#
	def addStrum(self,strum):
		self.bars[-1].append(strum)
		self.qbPos += strum.getQBLength()
		if self.qbPos > self.getBeats()*4:
			raise Exception("Bar is too long")
		self.strumCount += 1
	#
	#	render as JSON
	#
	def render(self):
		render = "{\n"
		for k in self.settings.keys():
			render = render+'"{0}":"{1}",\n'.format(k,self.settings[k])
		render = render+'"bars":[\n'
		render = render+",\n".join(['    "'+self.renderBar(b)+'"' for b in self.bars])
		return render+"\n]\n}\n"
	#
	#	render a Bar
	#
	def renderBar(b,strums):
		return ":".join([x.render() for x in strums])

# ***************************************************************************************
#
#											Compiler
#
# ***************************************************************************************

class Compiler:
	def __init__(self):
		self.chordMusic = MerlinJSON()
		self.tuneMusic = MerlinJSON()
	#
	#	Compile a file.
	#
	def compile(self,fileName):
		src = [x.replace("\t"," ").lower() for x in open(fileName).readlines()]
		src = [x if x.find("//") < 0 else x[:x.find("//")] for x in src]	
		src = [x.strip() for x in src]
		# handle variales
		for parts in [x for x in src if x.find(":=") >= 0]:
			parts = [x.strip() for x in parts.split(":=")]
			#print(parts)
			self.tuneMusic.setVariable(parts[0],parts[1])
			self.chordMusic.setVariable(parts[0],parts[1])
		self.strumPattern = "d-" * self.tuneMusic.getBeats()
		self.currentChord = None
		#print(self.strumPattern)
		# handle music lines
		for lines in [x for x in src if x.find(":=") < 0]:
			bars = lines.strip().split("|")
			for b in bars:
				if b != "":
					self.chordInfo = [ self.currentChord ] * self.tuneMusic.getBeats()
					self.chordMusic.addBar()
					self.tuneMusic.addBar()
					for item in [x.strip() for x in b.split(" ") if x.strip() != ""]:
						self.compileElement(item)
					if len([x for x in self.chordInfo if x is not None]):
						self.renderStrumming(self.chordInfo,self.strumPattern)
						self.currentChord = self.chordInfo[-1]
	#
	#	Compile a single element.
	#
	def compileElement(self,item):
		if item[0] == '[':
			self.compileChordInfo(item)
			return 		
		if item[0] == '{' and item[-1] == '}':
			self.strumPattern = item[1:-1]
			if len(self.strumPattern) != self.tuneMusic.getBeats() * 2:
				raise Exception("Bad strum pattern "+item)
			return
		# handle a normal strum.
		m = re.match("^([0-9x\&\+]+)([o\-\=\.]*)$",item)
		if m is None:
			raise Exception("Cannot fathom strum "+item)
		#print(m.groups())
		qbLength = self.getLength(m.group(2))
		s = Strum(m.group(1),qbLength)
		self.tuneMusic.addStrum(s)
	#
	#	Get QB Length from a list of modifiers
	#
	def getLength(self,modifiers):
		qbLength = 4
		for m in modifiers:
			if m == 'o':
				qbLength += 4
			elif m == '-':
				qbLength -= 2
			elif m == '=':
				qbLength -= 3
			elif m == '.':
				qbLength = int(qbLength * 3 / 2)
		return qbLength
	#
	#	Analyse chord info.
	#
	def compileChordInfo(self,desc):
		desc = desc if desc.find("@") >= 0 else desc[:-1]+"@1"+"]"
		m = re.match("^\[([0-9x\&\+]+)\@(\d)\]$",desc)
		if m is None:
			raise Exception("Can't fathom chord "+desc)
		for p in range(int(m.group(2))-1,len(self.chordInfo)):
			self.chordInfo[p] = m.group(1)
	#
	#	Render Strumming
	#
	def renderStrumming(self,beatChord,pattern):
		for hb in range(0,cm.chordMusic.getBeats()*2):
			fretting = beatChord[int(hb/2)]
			if self.strumPattern[hb] != "-":
				cm.chordMusic.addStrum(Strum(fretting,2))
			else:
				cm.chordMusic.addStrum(Strum("xxx",2))

cm = Compiler()
cm.compile("demo.merlin")

open("../app/music.json","w").write(cm.tuneMusic.render())
open("../app/music.json","w").write(cm.chordMusic.render())



# TODO:
# 	Get the title when rendering
# 	Chord dictionary.
# 	Put tune and chords seperately in player
#	Try a real song.