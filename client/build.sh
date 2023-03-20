image_name=hierarchical-categories_build_client;
container_name=HierarchicalCategoriesBuildClient;

# build new container for build vue app
docker build  -f Dockerfile -t $image_name .  || true;
# run container
docker run --name $container_name -itd $image_name;
# copy from container's dist folder to local dist foler
docker cp $container_name:/app/dist .
# remove container after using;
docker container rm -f $container_name;
# remove image after using;
docker rmi -f $image_name;
