# Broadcast Assistant Function

I needed a serverless HTTP function that tells Google Assistant to broadcast a message on all speakers hooked up to an account.

Based majorly on [endoplasmic's google-assistant package][gapackage].

[gapackage]: https://github.com/endoplasmic/google-assistant

This function is to be deployed to a Google Cloud Platform project.

The original purpose of this project is to provide an shared secret endpoint that devices such as Samsung SmartThings or some other IoT setup can call out to on the public internet to say something on their speakers with a simple call.

Unfortunately, this particular implementation isn't exactly a "multi-tenant" SASS. It's merely an adaptaion of the console example from [that google-assistant package][gapackage] to use cloud facilities instead of OS facilities with a hardcoded message prefix.

Not sure if it'll ever be multi-tenant. I mean, with all that news about privacy, do you really want to give some third party access to your Google Account?

## Setup Steps

TODO

1. `yarn install`
1. `yarn build`
1. ?

## Uses

* Doorbell
* Laundry Machines
* Cooking Appliances
* Freaking out people
* Software Development Build Status and Lifecycle
