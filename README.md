# azure-training-pulumi
azuredevcollege/trainingdays scm breakout app infrastructure with Pulumi


I wanted to do a quick setup with Pulumi in order to see how fast I would be in contrast to use ARM templates in this session: https://github.com/azuredevcollege/trainingdays/blob/master/day2/challenges/challenge-bo-3.md

Until now I invested around 1h for this...

[![asciicast](https://asciinema.org/a/385869.svg)](https://asciinema.org/a/385869)

## SCM Breakout App infrastructure with Pulumi

https://www.pulumi.com/docs/get-started/azure/
```shell
mkdir scmbreakoutpulumi  && cd scmbreakoutpulumi
pulumi new azure-typescript
```

#### Storage Account

https://www.pulumi.com/docs/reference/pkg/azure/storage/

https://www.pulumi.com/docs/reference/pkg/azure/storage/account/

###### Container

https://www.pulumi.com/docs/reference/pkg/azure/storage/container/

###### Queues

https://www.pulumi.com/docs/reference/pkg/azure/storage/queue/

#### App Service

https://www.pulumi.com/docs/reference/pkg/azure/appservice/appservice/

###### Slots

https://www.pulumi.com/docs/reference/pkg/azure/appservice/slot/


#### FunctionApp

We don't have a Function in the setup, we have

https://github.com/pulumi/examples/blob/master/azure-ts-functions-raw/index.ts

The setup uses a `azure.appservice.FunctionApp` !

https://www.pulumi.com/docs/reference/pkg/azure/appservice/functionapp/


## Architecture of the app

See https://github.com/azuredevcollege/trainingdays/blob/master/day2/challenges/challenge-bo-3.md (all kudos go there!)

![architecture_day2](screenshots/architecture_day2.png)

Have a look into the Azure Portal

![azure-resource-group](screenshots/azure-resource-group.png)



## TODO

* Application Insights?