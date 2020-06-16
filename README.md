# FrontendService
This is the frontend-service of the Lisk delegate market project. It was made as a groupproject for Fontys. 

It was made with react ts and will function as the webclient for the Lisk Delegate Market. To get more insight about the product click [here](https://github.com/S65-2-project). If you want to see the live product it can be found [here](https://delegate-market.nl).

The frontend-service enables the user to use the application in a smooth browser ui.

## External sources
To run this project you will need to run the following services:
- [account-service](https://github.com/S65-2-project/AccountService)
- [marketplace-service](https://github.com/S65-2-project/MarketplaceService)
- [email-service](https://github.com/S65-2-project/EmailMicroservice)
- [communication-service](https://github.com/S65-2-project/CommunicationService)

## Configuration
This is an example for the config.json file that is needed to configure the application. 

```json
{
  "SERVICES":{
    "ACCOUNT_SERVICE_URL": "",
    "DAPP": "",
    "DELEGATE" : "",
    "COMMUNICATION_SERVICE" : "",
    "CHAT_SERVICE": ""
  }
}
```

## Github Actions
The project runs on GitHub Actions with 3 different configuration.

1. All feature/* branches will be tested and build.
2. In addition to the steps of step 1 develop branch pushes will also be deliver to dockerhub and deploy to our develop environment.
3. All pushes on a tag will be deliverd and deployed to our kubernetes environment.   

To reproduce the Pipeline the following secrets are needed:
- DOCKER_ACCESS_TOKEN : The access token or password of the docker registry
- DOCKER_USER : The username of the docker registry
- GPG_PASSPHRASE : The secret passphrase that is used to encrypt and decrypt the GPG files
- KUBE_CONFIG : The kubeconfig file to access the kubernetes cluster
- SONARCLOUD_ACCESS_TOKEN : The access token for sonarcloud

## Delivery
All the images are stored on DockerHub. These are also on a public repo and can be found [here](https://hub.docker.com/repository/docker/s652/frontend-service).
All images with a SHA tag are development builds and versions with a version tag are production builds. 

## Deployment
The project is deployed to a kubernetes cluster. in de ./kube_develop folder are all the different kubernetes configuration files for the development builds.  In the ./kube folder are the configuration files for the production builds. 

- autoscaler.yaml -> this is the autoscaler for the deployment
- cluster-issuer.yaml-> to ensure there is a cluster issuer for the TLS certificates
- deployment.yaml -> the deployment of the service itself
- ingress.yaml -> the ingress that is used to access the deployment from outside, it is enabled with a TLS certificate
- service.yaml -> the service that exposes the deployment for other services and resources within the cluster
