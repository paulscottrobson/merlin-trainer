#
#	Notebutton graphics creator.
#
from PIL import Image,ImageDraw
import math

widthGroup = [ 30,60,90,120,150,200,250,300 ]
xOrigin = 200
yOrigin = 200

for width in widthGroup:
		im = Image.new("RGBA",(600,300),0x00000000)
		draw = ImageDraw.Draw(im)
		points = [x for x in range(0,width,7)]
		points.append(width)
		height = min(width,150)

		for p in points:
			x = xOrigin + p 
			y = yOrigin - math.sin(p * 3.14159 / width) * height
			r = 3
			draw.ellipse((x-r,y-r,x+r,y+r),fill = 0xFF00FFFF,outline = 0xFF000000)
			#draw.ellipse((x-1,y-1,x+1,y+1),fill = 0xFFFFFFFF)
#		if (offset3D != 0):
#			c1 = 0xFF808080
#			y = yc + y3d
#			draw.ellipse((xl-roundWidth/2,y-height/2,xl+roundWidth/2,y+height/2),fill = c1)
#			draw.ellipse((xr-roundWidth/2,y-height/2,xr+roundWidth/2,y+height/2),fill = c1)
#			draw.rectangle((xl,y-height/2,xr,y+height/2),fill = c1)
#		c1 = 0xFFFFFFFF
#		y = yc
#		draw.ellipse((xl-roundWidth/2,y-height/2,xl+roundWidth/2,y+height/2),fill = c1)
#		draw.ellipse((xr-roundWidth/2,y-height/2,xr+roundWidth/2,y+height/2),fill = c1)
#		draw.rectangle((xl,y-height/2,xr,y+height/2),fill = c1)
		name = "source/sinecurve_{0}.png".format(width)
		im2 = im.crop((xOrigin,yOrigin-height-10,xOrigin+width,yOrigin))
		im2.save(name)
		#print(name)