#
#	Notebutton graphics creator.
#
from PIL import Image,ImageDraw
import math

def endx(x,y):
	return int((x-600)*0.9*(y/800+0.17)+600+0.5)

def line(x1,y1,x2,y2,colour):
	n = 0
	while n < 1000:
		x = (x2 - x1) * n / 1000 + x1
		y = (y2 - y1) * n / 1000 + y1
		c = colour
		if y < 170:
			scalar = 1-(170-y)/120
			c = [c & 0xFF,(c >> 8) & 0xFF,(c >> 16) & 0xFF]
			c = [int(x * scalar) for x in c]
			c = tuple(c)
		draw.point((x,y),fill=c)
		n = n + 0.5

widthGroup = [ 30,60,90,120,150,200,250,300 ]
xOrigin = 200
yOrigin = 200

frame =  0xFFA2AA00
backgr = 0xFF000000
board =  0xFF07183B
info = 0xFFD9760D

im = Image.new("RGBA",(1200,800),backgr)
draw = ImageDraw.Draw(im)
edge = 40
x = 0
while x < 1200:
	colour = frame if x < edge or x > 1200-edge else board
	y = 800 if colour == frame else 700
	line(endx(x,0),0,endx(x,y),int(y),colour)
	xo = x if (x < 600) else 1200-x
	y2 = 800 if xo > 400 else 700+math.sin(xo/400*math.pi/2)*100
	line(endx(x,y),int(y),endx(x,y2),y2,frame)
	x = x + 0.5

for sid in range(1,11):
	sw = 3
	sx = 1200 * sid / 11
	for x in range(-sw,sw+1):
		sc = 160 + x * 20
		line(endx(x+sx,700),700,endx(x+sx,0),0,sc+sc*256+sc*65536+0xFF000000)

draw.rectangle((0,0,1200,50),fill=info)

for x in range(50,200):
	pass

im.save("source/frame.png")