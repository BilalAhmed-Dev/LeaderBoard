#!/bin/bash

AKS_RESOURCE_GROUP=DemoResource
AKS_CLUSTER_NAME=DemoAks
ACR_RESOURCE_GROUP=DemoResource
ACR_NAME=TempDemoACR

# Get the id of the service principal configured for AKS
CLIENT_ID=$(az aks show --resource-group $AKS_RESOURCE_GROUP --name $AKS_CLUSTER_NAME --query "servicePrincipalProfile.clientId" --output tsv)
SUB_ID=$(az account show --query "id" --output tsv)
# Get the ACR registry resource id
ACR_ID=$(az acr show --name $ACR_NAME --resource-group $ACR_RESOURCE_GROUP --query "id" --output tsv)

# Create role assignment
az role assignment create --assignee $CLIENT_ID --role acrpull --scope $ACR_ID

#Create Network Contributor Role Assignment to allow static public ip assignment for k8s load balancers
az role assignment create\
    --assignee $CLIENT_ID \
    --role "Network Contributor" \
    --scope /subscriptions/$SUB_ID/resourceGroups/$AKS_RESOURCE_GROUP
