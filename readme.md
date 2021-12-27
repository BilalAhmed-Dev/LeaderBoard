### Overview:

---

This is a horizontally scalable leaderboard application for a game that has active players. Leaderboard will be sorted according to the money each player has earned since the start of the week. The leaderboard will reset each week **or once the Click here anchor is clicked**" for testing purposes". Once the
Leaderboard resets, the top 100 players will be rewarded with in-game money according to their rankings and everything will start over.

### Application Features:

---

- Architecture of the system is horizontally scalable.

- High Performance (Thanks to the power of Kubernetes and Azure Cloud)

- Cloud Compatible (K8s Scripts and Docker Compose included)

- Display top 100 players.

- If the players below or above the logged-in user are not one of the top 100 they will be displayed at the end of the table along with the logged-in user as follows: 2 below and 3 above and above them the top 100 players.

- The logged-in user row will be highlighted

- The player's Daily Diff will be 0 initially but once the user starts adding scores the Daily Diff will change to 1 if the player rank increases and -1 if it decreases and if the player remains at the same rank, The Daily Diff will be 0.

- The Daily Diff number will be yellow if 0, green if 1, red if -1.

- 2% of the money earned by all players during the week will be collected in the prize pool, and at the end of the week, the collected money will be distributed among users according to their ranks as follow:

1. player 1 will get 20% of the pool
2. player 2 will get 15% of the pool
3. player 3 will get 10% of the pool
4. The remaining prize will be given to the other players in the top 100 in order to the rank of the players.

### Deployment Guide

---

The application has been designed to be deployed in two ways locally and on the cloud.

**Local Deployment Guide**
To run the application locally follow the steps below

- Clone the repository from [gitHub](https://github.com/BilalAhmed-Dev/FullStack-Leaderboad-Challenge)

`$ git clone https://github.com/BilalAhmed-Dev/FullStack-Leaderboad-Challenge`

- Install docker [Quick start guide](https://phoenixnap.com/kb/how-to-install-docker-on-centos-8)
- Install docker-compose [Quick start guide](https://unihost.com/help/how-to-install-and-use-docker-compose-on-centos-8)
- Use the application included quickstart scripts using the following commands:

1. chmod 777 quickstart.sh
2. ./quickstart.sh

### Cloud Deployment Guide

---

**Cloud Deployment diagram architecture** : [LeaderBoardDiagram.drawio](https://github.com/BilalAhmed-Dev/FullStack-Leaderboad-Challenge/blob/master/LeaderBoardDiagram.drawio) download and open with a tool like [diagrams](https://app.diagrams.net/)

The cloud deployment guide uses Azure AKS service, you need to have a valid Azure subscription and sufficient access to the required services.

Login to Azure and open azure cloud shell, for this example we are using the bash terminal

- Create Resource Group
- New-AzResourceGroup -Name DemoResource -Location "East US"

  - From [here](https://docs.microsoft.com/en-us/powershell/module/az.resources/new-azresourcegroup?view=azps-7.0.0)

- Create Service Principal
- az ad sp create-for-rbac --name DemoAKSClusterServicePrincipal
  - From [here](https://docs.microsoft.com/en-us/azure/aks/kubernetes-service-principal?tabs=azure-cli)
- Create AKS Cluster

```
--az aks create --resource-group DemoResource --name DemoAks \
--enable-addons monitoring,http_application_routing \
--kubernetes-version 1.22.2 --generate-ssh-keys \
--service-principal 712fb770-ce3f-4bf2-a8bd-1fe6fc9941aa --client-secret UQjpOZ.YZr0j1KP6BYg9rQryH9lmzrvlhb --node-count 2 \
--vm-set-type VirtualMachineScaleSets \
--load-balancer-sku standard \
--enable-cluster-autoscaler \
--min-count 1 \
--max-count 5
```

- Get Credentials

```
 - az aks get-credentials --resource-group DemoResource --name DemoAks
```

- This command creates the kubectl configs to allow you to make changes later

- Create a docker-registry to upload our docker images

```
az acr create --resource-group DemoResource --name TempDemoACR --sku Basic --admin-enabled true
```

- Clone the application repository [gitHub](https://github.com/BilalAhmed-Dev/FullStack-Leaderboad-Challenge)

`$ git clone https://github.com/BilalAhmed-Dev/FullStack-Leaderboad-Challenge`

- Update Parameters and Run ACR Script

  - Note Make sure to have user access role assignment and user access administrator assignment in AD to avoid permission errors
  - ACR Script [Link](https://github.com/jaydestro/aks-acr-all-in-one)

- Get the Azure repository DNS name

```
az acr list --resource-group myResourceGroup --query "[].{acrLoginServer:loginServer}" --output table
```

- Update all the K8s images URLs in the deployment file
- For these steps, you will need to tag and push the images, if you are unable to do this using azure CLI you can run docker-compose locally then tag and push the images

  - docker tag nodejs-redis-docker_backend:v1 <acrLoginServer>/ nodejs-redis-docker_backend:v1
  - docker tag nodejs-redis-docker_frontendv1 <acrLoginServer>/ nodejs-redis-docker_frontend:v1

  - docker tag mongo:v1 <acrLoginServer>/ mongo:v1
  - docker tag redis:v1 <acrLoginServer>/ redis:v1

- Build and push the image

```
az acr build --registry TempDemoACR --image react-clock-basic:v1 .
```

- Deploy the deployment and the load balancer

- Navigate to the k8s folder in the repo using cd k8s

```
  Kubectl apply -f ./deployment.yaml
```

### How to use the application

---

###Front End

- On the login page you can either login by inserting a userId in the input

  - Use the back end API to create a new user "Check the back end section for more info" and use the returned user userId to login

    - Or you can skip the log-in process by clicking the Skip button and you will be redirected to the Leaderboard page.

- In the leader board page if there is a game in progress you the user will be able to see a table that has a record of the top 100 players as well as the logged in user if there is one and if the user is logged in his name will be highlighted.

  - If the logged-in user rank is below 100, the user will be displayed along with 2 players below him and 3 above him, and then the top 100 players
    - If there is no game in progress the leaderboard table will be empty until players start playing and gain scores for it to display on the leaderboard
    - For testing purposes, the tester can use a tool like postman to mimic a player gaining score by using the addScore API endpoint (calling the endpoint will be explained in the backend section)

- The user can use the navigation on the left to navigate between pages
- On the PrizePoolTable page if a week has already passed since the start of players playing and gaining scores Prizes will be distributed among 100 players according to what has been explained in the Overview sections.
  - For testing purposes, there is an anchor tag that is called "Click me" it will trigger the end of the game without the need to wait a whole week, which will reset everything and prizes will be distributed among the top 100 players.

###Back End

---

- The backend can run locally and on a server
- **important**: The API POST request expects the body data to
  come in an `x-www-form-urlencoded` format and not as JSON

- Use a tool like [postman](https://www.postman.com/) to reach the API endpoints

###The endpoints

1- http://localhost/api/signup

- a POST request with this body data :
  - userName=YourUserName
  - age=YourAge
    - The response is ` New User has been created successfully` and a **userId**
    - you can use the **userId** in the response to **login** in the newly created user.

2- http://locahost/api/login

- a POST request with this body data :
  - userId=YourUserId
    - The response is `User login status` and a status of 1 or 0
    - 1 means you are logged in, 0 means no user exists with the inserted userId

3- http://locahost/api/logout

- a POST request with this body data :
  - userId=YourUserId
    - The response is `User Logged out Successfully`

4- http://locahost/api/addNewScore

- note : A **user must be logged in to add a score** to any other user
- a POST request with this body data :
  - userId=YourUserId
  - score=TheDesiredScore
    - The response is
      `{ 'status': 'Score updated successfully'}`
    - or The response is
      ` {'status': 'Player is not online!'}`"whichs means you need to log in first"

5- http://locahost/api/getTop100

- a POST request with body data Or **nothing at all** :

  - userId=YourUserId
  - if you do not pass a userId only the top 100 players will be displayed.
    - for example if your player rank is 140 you will not be able to see your player unless you pass a userId (login), once logged in you will be able to see your player rank and 2 players below you and 3 players above you and the top 100 players.

- The response is an Array of Objects containing the top 100 players sorted in ascending order from 1 to 100

6- http://locahost/api/triggerEndGame

- a POST request with empty or no body data.
  - The response is `Ok!`
    - which means the end of the week has been triggered and the PrizePoolTable has been filled with data displaying the results

7- http://locahost/api/getPrizePool

- a GET request
  - note: triggerEndGame need to be called before calling this endPoint or an empty array will be returned `[]`
    - The response is an Array of Objects containing the results of the game
      - only the top 100 players will get prizes and the earned amount will be displayed in a column called gain.

##Todos:

- Changing the current Auth process that uses userId with **user name and
  password**
- Creating and configure map for mongoDB

- Allowing only admin to add scores to players.
