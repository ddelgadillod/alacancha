#Auth
SERVICE=auth
VERSION=latest
IMAGE=acralacancha.azurecr.io/$SERVICE:$VERSION
docker build -t $IMAGE ../$SERVICE/
docker push $IMAGE

#spot
SERVICE=spot
VERSION=latest
IMAGE=acralacancha.azurecr.io/$SERVICE:$VERSION
docker build -t $IMAGE ../$SERVICE/
docker push $IMAGE

#calificacion
SERVICE=calification
VERSION=latest
IMAGE=acralacancha.azurecr.io/$SERVICE:$VERSION
docker build -t $IMAGE ../calificacion/
docker push $IMAGE

#notificaciones
SERVICE=notification
VERSION=latest
IMAGE=acralacancha.azurecr.io/$SERVICE:$VERSION
docker build -t $IMAGE ../notificaciones/
docker push $IMAGE