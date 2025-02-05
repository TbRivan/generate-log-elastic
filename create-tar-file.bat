: $1 argument that contain the version of the image etc. beta1
: or run the command like: create-tar-file.bat beta1

docker build . -t react-import-price:%1
docker save -o react-import-price-%1.tar react-import-price:%1
