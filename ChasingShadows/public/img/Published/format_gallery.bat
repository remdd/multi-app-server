rem	Images are formatted using Image Magick command line utility

rem	Resize images to a max of 1250px along longest edge
magick mogrify -resize "1250x1250^" *.jpg 

rem	Create thumbnail folder and copy all images into it
mkdir thumbs
cp *.jpg thumbs\

rem	Resize thumbnails to 400px wide
cd thumbs
magick mogrify -resize "400" *.jpg
