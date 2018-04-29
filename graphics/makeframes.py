#
#	Notebutton graphics creator.
#
from PIL import Image,ImageDraw

height = 50
roundWidth = 40
y3d = 8
widthGroup = [ 0,10,25,40,66,75,100,150,200,250,300 ]

for width in widthGroup:
	for offset3D in range(1,2):
		xl = 100+roundWidth/2
		xr = xl + width
		yc = 100
		im = Image.new("RGBA",(600,200),0x00000000)
		draw = ImageDraw.Draw(im)
		if (offset3D != 0):
			c1 = 0xFF808080
			y = yc + y3d
			draw.ellipse((xl-roundWidth/2,y-height/2,xl+roundWidth/2,y+height/2),fill = c1)
			draw.ellipse((xr-roundWidth/2,y-height/2,xr+roundWidth/2,y+height/2),fill = c1)
			draw.rectangle((xl,y-height/2,xr,y+height/2),fill = c1)
		c1 = 0xFFFFFFFF
		y = yc
		draw.ellipse((xl-roundWidth/2,y-height/2,xl+roundWidth/2,y+height/2),fill = c1)
		draw.ellipse((xr-roundWidth/2,y-height/2,xr+roundWidth/2,y+height/2),fill = c1)
		draw.rectangle((xl,y-height/2,xr,y+height/2),fill = c1)
		name = "source/notebutton_{0}_{1}.png".format("up" if offset3D != 0 else "down",width)
		im2 = im.crop((xl-roundWidth/2-2,yc-height/2-2,xr+roundWidth/2+2,yc+height/2+y3d+2))
		im2.save(name)
		#print(name)