import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure";

// Create an Azure Resource Group
const resourceGroup = new azure.core.ResourceGroup("scm-breakout-rg-pulumi");

const examplePlan = new azure.appservice.Plan("asp-scmbreakoutrg", {
    location: resourceGroup.location,
    resourceGroupName: resourceGroup.name,
    sku: {
        tier: "Standard",
        size: "S1",
    },
});

// ContactsAPI Service

const scmBreakoutContactsApi = new azure.appservice.AppService("scm-breakout-contactsapi-pulumi", {
    location: resourceGroup.location,
    resourceGroupName: resourceGroup.name,
    appServicePlanId: examplePlan.id,
    siteConfig: {
        dotnetFrameworkVersion: "v4.0",
        scmType: "LocalGit",
    }
});

// ResourcesAPI Service, Storage Account, Function

// Create an Azure resource (Storage Account)
const storageaccount = new azure.storage.Account("scmbreakresources", {
    // The location for the storage account will be derived automatically from the resource group.
    resourceGroupName: resourceGroup.name,
    accountTier: "Standard",
    accountReplicationType: "LRS",
});

const scmBreakoutResourceApi = new azure.appservice.AppService("scm-breakout-resourcesapi-pulumi", {
    location: resourceGroup.location,
    resourceGroupName: resourceGroup.name,
    appServicePlanId: examplePlan.id,
    siteConfig: {
        dotnetFrameworkVersion: "v4.0",
        scmType: "LocalGit",
    },
    appSettings: {
        ImageStoreOptions__StorageAccountConnectionString: storageaccount.primaryConnectionString,
        ImageStoreOptions__ImageContainer: "rawimages",
        "ImageStoreOptions-__ThumbnailContainer": "thumbnails",
        StorageQueueOptions__StorageAccountConnectionString: storageaccount.primaryConnectionString,
        StorageQueueOptions__Queue: "thumbnails",
        StorageQueueOptions__ImageContainer: "rawimages",
        StorageQueueOptions__ThumbnailContainer: "thumbnails"
    },
});

// const dotnetApp = new azure.appservice.ArchiveFunctionApp("breakoutfunction", {
//     resourceGroup,
//     archive: new pulumi.asset.FileArchive("./dotnet/bin/Debug/netcoreapp2.1/publish"),
//     appSettings: {
//         "runtime": "dotnet",
//         "AzureWebJobsDashboard": storageaccount.primaryConnectionString,
//         "AzureWebJobsStorage": storageaccount.primaryConnectionString,
//         "StorageAccountConnectionString": storageaccount.primaryConnectionString,
//         "QueueName": "thumbnails",
//         "FUNCTIONS*EXTENSION_VERSION": "*~2_",
//         "ImageProcessorOptions__StorageAccountConnectionString": storageaccount.primaryConnectionString,
//         "ImageProcessorOptions__ImageWidth": 100
//     },
// });


// Export the connection string for the storage account
export const connectionString = storageaccount.primaryConnectionString;
