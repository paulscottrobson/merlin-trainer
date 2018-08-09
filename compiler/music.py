# ****************************************************************************************
# ****************************************************************************************
#
#		Name:		music.py
#		Purpose:	Basic Music Object Classes
#		Date:		9th August 2018
#		Author:		Paul Robson (paul@robsons.org.uk)
#
# ****************************************************************************************
# ****************************************************************************************

import re

# ****************************************************************************************
#								This class represents a bar
# ****************************************************************************************

class Bar(object):
	#
	#		Initialise the bar
	#
	def __init__(self,beats = 4,barData = ""):
		barData = barData.replace("\t"," ").strip()
		self.beats = beats 										# beats in bar
		self.qbPosition = 0 									# current position
		self.render = "" 										# current rendering
		for nData in barData.split(" "):						# copy provided bar data in.
			if nData != "":
				self.add(nData)
	#
	#		Advance the bar time position
	#
	def advance(self,quarterBeats):
		assert quarterBeats >= 1 and quarterBeats <= 26,"Bad Quarterbeat count"
		self.qbPosition += quarterBeats 						# advance position
		self.render += chr(quarterBeats+ord('A')-1)				# adjust render
		assert self.qbPosition <= self.beats * 4 				# can't go further than this.
	#
	#		Play a note in.
	#
	def play(self,melody,middle,bass):
		assert melody is None or (melody >= 0 and melody <= 7),"Bad melody string"
		assert middle is None or (middle >= 0 and middle <= 7),"Bad middle string"
		assert bass is None or (bass >= 0 and bass <= 7),"Bad bass string"
		if melody is not None:									# add notes
			self.render += chr(melody + ord('q'))
		if middle is not None:
			self.render += chr(middle + ord('i'))
		if bass is not None:
			self.render += chr(bass + ord('a'))
	#
	#		Add a play in in standard format 
	#
	def add(self,note):
		note = note.upper().replace("&","X")					# & is rest, so becomes no strum.
		m = re.match("^([0-7X]+)([O\.\-\=]*)$",note)			# correct format
		assert m is not None,"Bad note "+note.lower()
		note = (m.group(1)+"XXX")[:3]							# pad note left with no-strum.
		self.play(None if note[0] == "X" else int(note[0]),
				  None if note[1] == "X" else int(note[1]),
				  None if note[2] == "X" else int(note[2]))
		length = 4 												# work out length
		for c in m.group(2):
			length += (4 if c == 'O' else 0)
			length -= (2 if c == '-' else 0)
			length -= (3 if c == '=' else 0)
			length = int(length*3/2) if c == '.' else length
		self.advance(length)
	#
	#		Get the current render
	#
	def getRender(self):
		return self.render
	#
	#		Convert back to string.
	#
	def toString(self):
		qbTime = 0
		r = self.getRender()
		rstr = ""
		while r != "":
			m = re.match("^([a-x]+)(.*)$",r)
			if m is not None:
				note = ["&","&","&"]
				for n in [ord(x) - ord('a') for x in m.group(1)]:
					note[2-int(n/8)] = chr(n%8+48)
				rstr = rstr + "{0:3}@{1}:{2} ".format("".join(note),int(qbTime/4),qbTime%4)
				r = m.group(2)
			else:
				if r[0] >= 'A' and r[0] <= 'Z':
					qbTime += (ord(r[0]) - ord('A') + 1)
					r = r[1:]
		return rstr

# ****************************************************************************************
#								This class represents a tune
# ****************************************************************************************

class Tune(object):
	#
	#		Create a new tune
	#
	def __init__(self,beats = 4,tempo = 100,music = ""):
		self.bars = []
		self.beats = beats
		self.tempo = tempo
		music = music.replace("\n","|")
		for barInfo in [x.strip() for x in music.split("|")]:
			if barInfo != "":
				self.addBar(barInfo)
	#
	#		Add a bar
	#
	def addBar(self,info = ""):
		self.bars.append(Bar(self.beats,info))
	#
	#		Render whole tune.
	#
	def getRender(self):
		tuneBit = "z".join([x.getRender() for x in self.bars])
		return "beats={0}&tempo={1}&music={2}".format(self.beats,self.tempo,tuneBit)
	#
	#		Convert to string
	#
	def toString(self):
		return "\n".join([x.toString() for x in self.bars])

if __name__ == "__main__":
	b1 = Bar(4,"765 X0=")
	b1.add("&72o")
	print(b1.getRender())
	print(b1.toString())

	tune = "& & X0- X0- | X1 X0 0 | X2o X0- X0- | X1 X0 1 | 0o X0- X0- | 4 2 0 | X2 X1 3- 3- | 2 0 1 | 0oo"
	t1 = Tune(3,100,tune)
	print(t1.getRender())
	print(t1.toString())

