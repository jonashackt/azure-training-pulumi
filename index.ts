import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure";

// SCM Resource Group
const resourceGroup = new azure.core.ResourceGroup("scm-breakout-rg-pulumi");

const scmbreakoutPlan = new azure.appservice.Plan("asp-scmbreakoutrg", {
    location: resourceGroup.location,
    resourceGroupName: resourceGroup.name,
    sku: {
        tier: "Standard",
        size: "S1",
    },
});

// ContactsAPI Service

const scmContactsApi = new azure.appservice.AppService("scmContactsApi", {
    location: resourceGroup.location,
    resourceGroupName: resourceGroup.name,
    appServicePlanId: scmbreakoutPlan.id,
    siteConfig: {
        dotnetFrameworkVersion: "v4.0",
        scmType: "LocalGit",
    }
});

// ResourcesAPI Service, Storage Account, Function

// Create an Azure resource (Storage Account)
const resourcesStorageAccount = new azure.storage.Account("scmbreakresources", {
    // The location for the storage account will be derived automatically from the resource group.
    resourceGroupName: resourceGroup.name,
    accountTier: "Standard",
    accountReplicationType: "LRS",
    allowBlobPublicAccess: true
});

const rawimagesContainer = new azure.storage.Container("rawimages", {
    storageAccountName: resourcesStorageAccount.name,
    containerAccessType: "blob",
});

const thumbnailsContainer = new azure.storage.Container("thumbnails", {
    storageAccountName: resourcesStorageAccount.name,
    containerAccessType: "blob",
});

const thumbnailsQueue = new azure.storage.Queue("thumbnails", {
    storageAccountName: resourcesStorageAccount.name
});

const scmResourceApi = new azure.appservice.AppService("scmResourceApi", {
    location: resourceGroup.location,
    resourceGroupName: resourceGroup.name,
    appServicePlanId: scmbreakoutPlan.id,
    siteConfig: {
        dotnetFrameworkVersion: "v4.0",
        scmType: "LocalGit",
    },
    appSettings: {
        ImageStoreOptions__StorageAccountConnectionString: resourcesStorageAccount.primaryConnectionString,
        ImageStoreOptions__ImageContainer: "rawimages",
        "ImageStoreOptions-__ThumbnailContainer": "thumbnails",
        StorageQueueOptions__StorageAccountConnectionString: resourcesStorageAccount.primaryConnectionString,
        StorageQueueOptions__Queue: "thumbnails",
        StorageQueueOptions__ImageContainer: "rawimages",
        StorageQueueOptions__ThumbnailContainer: "thumbnails"
    },
});

const scmResourceApiSlot = new azure.appservice.Slot("scmResourceApiStg", {
    appServiceName: scmResourceApi.name,
    location: resourceGroup.location,
    resourceGroupName: resourceGroup.name,
    appServicePlanId: scmbreakoutPlan.id,
    siteConfig: {
        dotnetFrameworkVersion: "v4.0",
        scmType: "LocalGit",
    },
    appSettings: {
        ImageStoreOptions__StorageAccountConnectionString: resourcesStorageAccount.primaryConnectionString,
        ImageStoreOptions__ImageContainer: "rawimages",
        "ImageStoreOptions-__ThumbnailContainer": "thumbnails",
        StorageQueueOptions__StorageAccountConnectionString: resourcesStorageAccount.primaryConnectionString,
        StorageQueueOptions__Queue: "thumbnails",
        StorageQueueOptions__ImageContainer: "rawimages",
        StorageQueueOptions__ThumbnailContainer: "thumbnails"
    },
});

const scmFunctionApp = new azure.appservice.FunctionApp("scmFunctionApp", {
    location: resourceGroup.location,
    resourceGroupName: resourceGroup.name,
    appServicePlanId: scmbreakoutPlan.id,
    storageAccountName: resourcesStorageAccount.name,
    storageAccountAccessKey: resourcesStorageAccount.primaryAccessKey,
    appSettings: {
        "runtime": "dotnet",
        "AzureWebJobsDashboard": resourcesStorageAccount.primaryConnectionString,
        "AzureWebJobsStorage": resourcesStorageAccount.primaryConnectionString,
        "StorageAccountConnectionString": resourcesStorageAccount.primaryConnectionString,
        "QueueName": "thumbnails",
        "FUNCTIONS*EXTENSION_VERSION": "*~2_",
        "ImageProcessorOptions__StorageAccountConnectionString": resourcesStorageAccount.primaryConnectionString,
        "ImageProcessorOptions__ImageWidth": "100"
    },
});


// Export the connection string for the storage account
export const connectionString = resourcesStorageAccount.primaryConnectionString;
