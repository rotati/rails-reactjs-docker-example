## Notes on how the apps were initially created

## Backend: Rails API

For details on developing with the Rails API check the apps [README](todoapi/README.md) file.

The following outlines how to create and dockerize a brand new Rails application.

* Create the Rails API via a ruby Docker Image `docker run -it --rm -v "$PWD":/usr/src/app -w /usr/src/app phusion/passenger-ruby24:0.9.27 gem install --no-rdoc --no-ri rails -v 5.1.4 && rails new --api --database postgresql todoapi`

This will create our new Rails app (including the Gemfile.lock). The remaining files are added and configured manually as follows:

* Add `Dockerfile`
* Add `docker-compose.yml`
* Add `webapp.conf` 
* Add `rails-env.conf`
* Add `setup.sh`. Set this file to executable `chmod +x setup.sh`.
* Add a customer logger in `config/application.rb` which sends logs to STDOUT so that we can use `docker-compose logs -f` (see below for starting the app).
* Update the database.yml file with the correct credentials for your database
* Add `.dockerignore`
* Add `push.sh` file for building and pushing the Docker image to Docker Hub. Set this file to executable `chmod +x push.sh`.

Make sure that all the paths are correct for the application for example in webapp.conf etc.

See all the above files in this repo for example content in each. Once all the above files are completed just run `./push.sh` to build and push the Docker image to Docker Hub (log into the `docker` cli tool first).

## Deploying an application to a Kubernetes Cluster on AWS 

The following explains how to setup and deploy an application to AWS using Kubernetes. 

### Initial setup - install KOPS and create a new cluster

* Install kops `brew install kops`
* In your AWS account create a KOPS IAM user with Administrator access. The name of the user can be anything. Make a note of the keys.
* In your AWS account create a subdomain hosted zone which will be used by KOPS. For example, create a new Route 53 Hosted Zone for 'kubernetes.blinkermail.com'. Then in the Hosted Zone for the parent, add a new Record Set for 'kubernetes.blinkermail.com' of type 'Nameserver' and pass in the Nameserver values from the sub-domain Hosted Zone just created.
* In your AWS account create a new S3 Bucket to store the state of the k8s cluster. Give it a name 'kops-state-<some-unique-id>' e.g. 'kops-state-rt7665'
* Run the kops create cluster command like so: `kops create cluster --name=kubernetes.blinkermail.com --state=s3://kops-state-rt7665 --zones=ap-southeast-1a --node-count=2 --node-size=t2.micro --master-size=t2.micro --dns-zone=kubernetes.blinkermail.com`
* To avoid having to use the '--state' flag for each command run `export KOPS_STATE_STORE=s3://kops-state-rt7665`
* To actually apply the new cluster in AWS you need to run the following update command `kops update cluster kubernetes.blinkermail.com --state=s3://kops-state-rt7665  --yes`
* Validate the cluster as follows `kops validate cluster --name=kubernetes.blinkermail.com --state=s3://kops-state-rt7665`
* list nodes: `kubectl get nodes --show-labels`
* To edit the cluster run `kops edit cluster --name=kubernetes.blinkermail.com --state=s3://kops-state-rt7665 `
* To update the number of nodes in the cluster edit the ig config like so `kops edit ig nodes`
* ssh to the master: `ssh -i ~/.ssh/id_rsa admin@api.kubernetes.blinkermail.com`
* To delete the cluster run the following `kops delete cluster --name=kubernetes.blinkermail.com --state=s3://kops-state-rt7665`
* Delete any volumes created also! `aws ec2 delete-volume --volume-id=<VOLUME-ID>`

## Deploy an application to the cluster

In this repo example, we can deploy the application to our running cluster of nodes in AWS by simply checking the current context of our `kubectl cluster-info` command is set to our AWS cluster and then creating our services, jobs and deployments withing our cluster usign the `kubectl create` command. NOTE: this has all been scriped in a bash file (see below).

For *first time* deployment you will need the kube config files. Add the following:

* Add file kube/deployments/postgres-deployment.yml
* Add file kube/deployments/todoapi-deployment.yml
* Add file kube/jobs/setup-job.yml
* Add a secret for production (this should be encrypted of course) `docker-compose run --rm todoapi bin/rake secret RAILS_ENV=producretion` (NOTE: copy the output to your secrets file)
* Create the EBS Volume for use on the database node `aws ec2 create-volume --region ap-southeast-1 --availability-zone ap-southeast-1a --size 10 --volume-type gp2` and add the volume id to the postgres-deployment.yml file
* Check the current context of kubectl is as expected `kubectl cluster-info`
* Run `kubectl create -f kube/deployments/`
* Run `deploy/migrate.sh` (if there are migrations to run)
* Setup a DNS name alias for the load balancer so that it can be accessed. This is done in Route 53 using the alias opton.
* Refer to notes above (under KOPS) for interacting with the cluster itself.

Thereafter, as we continually develop the application we can do the following:

* Make changes to the application as necessary (see development steps above)
* Commit these changes to github
* Run `deploy/push.sh` to build new image and push that image to Docker Hub and deploy it to our Kubernetes Cluster.
* If there are migrations then run `deploy/migrate.sh`
* Check the logs using  `kubectl logs <POD ID>` (use `kubectl get pods` to see the pod ids)

Other commands that are useful during setup and deployment

* Check deployment status `kubectl rollout status`
* List previous deployments `kubectl rollout history`
* Undo / Rollback a deployment `kubectl rollout undo`
* Undo / Rollback to a specific version of deployment `kubectl rollout undo --to-revision=n`
* Create a configmap `ks create configmap <CONFIGMAP-NAME> --from-file=<FILE-CONTAINING-CONFIG>` for example to create a configmap for Nginx configuration run `ks create configmap niginx-config --from-file=configmap/reverseproxy.conf`
* Execute a command within a container `kubectl exec <POD-NAME> -it -- <COMMAND-TO-EXECUTE>` for example to connect to a MySQL instance in a POD called 'database' `kubectl exec <POD-NAME> -it -- mysql -u root -p` or another example, to start a bash shell in a pod called 'helloworld-deployment-5dc4bb99fd-gf8nd' `kubectl exec helloworld-deployment-5dc4bb99fd-gf8nd -it -- bash`
* Execute a command in a temp container (usually 'busybox') then run the following `kubectl run -i --tty busybox --image=busybox --restart=Never -- bash`

## Frontend: ReactJS Client

For details on developing with the ReactJS App check the apps [README](todoapp/README.md) file.

* Create the new React JS app via an npm Docker Image  `docker run -it --rm -v "$PWD":/usr/src/app -w /usr/src/app node:slim npm install -g create-react-app && create-react-app todoapp`

This will create our new Rails app (including the package-lock.json). The remaining files are added and configured manually as follows:

* Add `Dockerfile`
* Add `push.sh` file for building and pushing the packaged app to S3 / Cloudfront as a static, serverless frontend application. Set this file to executable `chmod +x push.sh`.

## TODO

* Create a specific staging environment for the React JS app and deploy that (https://github.com/facebookincubator/create-react-app/issues/790
https://stackoverflow.com/questions/30568796/how-to-store-configuration-file-and-read-it-using-react)
* Encript the Staging and Production database password and the application secret
* Test quickly switching between the two envionments (should work seamlessly)
* Auto deploy entire app via CI server (codeship)

## TODO (later)

* Have the tests run as part of the docker-compose process (in separate containers)
* Setup integration testing for the applications 
* Have development environment working without needing CORS by using reverse proxy Nginx
* Use RDS for the Postgres database in Production 
* Deploy the frontend to cloud front
* Document the API using Swagger (https://www.sitepoint.com/do-the-right-thing-and-document-your-rails-api-with-swagger/)