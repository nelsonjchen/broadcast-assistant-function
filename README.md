# Broadcast Assistant Function

I needed a serverless HTTP function that tells Google Assistant to broadcast a message on all speakers hooked up to an account.

Based majorly on [endoplasmic's google-assistant package][gapackage].

[gapackage]: https://github.com/endoplasmic/google-assistant

This function is to be deployed to a Google Cloud Platform project.

The original purpose of this project is to provide an shared secret endpoint that devices such as Samsung SmartThings or some other IoT setup can call out to on the public internet to say something on their speakers with a simple HTTP call.

There is no need for a Raspberry Pi on the network like with [assistant relay][assistant-repay]. That said, other implementations that do run on the Raspberry Pi or something similar need internet anyway as a connection is required to connect to Google's servers to utilize Google Assistant's "broadcast <msg>" command.

By design, this particular implementation isn't exactly a "multi-tenant" SASS. It's merely an adaptaion of the console example from [that google-assistant package][gapackage] to use cloud facilities instead of OS facilities with a hardcoded message prefix. With all that news about privacy, do you really want to give some third party access to your Google Account? Best to keep the third-parties down to just Google's more privacy oriented division anyway.

[assistant-relay]: https://github.com/greghesp/assistant-relay

## Setup Steps

### Prerequisites

* Google Cloud SDK
* Google Cloud Platform Project
* (Optional) Google Cloud Functions Emulator.
* A Google Cloud Storage bucket where the tokens will be stored.

### Credentialing

Get the console-input demo on [endoplasmic's google-assistant package][gapackage] going.

Follow the instructions there to get `credentials.json` of the generated Google Assistant device API credentials from Google's page. While you're there, also collect your Google Account's `tokens.json` made with said device. The serverless function will not have an interface, so these are the semi-temporary keys you will need to jump-start this function. Put `credentials.json` in the `src` folder.

While you have that setup, use the console-input demo to test "broadcast Hello World!" as a command. In a few seconds, or perhaps what it feels like to be forever but trust me it'll come soon, the speakers in the household should say "Hello World!".

### Project Setup

1. Create a new Google Cloud Platform project if you haven't already.
1. Ensure you are logged into Gcloud CLI.
1. Make a bucket in the project
1. Put `tokens.json` from earlier at the root of the bucket.
1. Make a `env.json` and put it inside the `src` folder. Make sure you change `shared-secret`. It will be checked on for every call coming in. If it matches, the function will continue.
    ```
    {
    "savedTokensBucket": "ur-bucket-name-here",
    "secret": "shared-secret"
    }
    ```
1. `yarn install`
1. `yarn build`
1. Fill `<projectidhere>` with your project ID and run this command from within the `src` folder.
    ```
    CLOUDSDK_CORE_PROJECT=<projectidhere>` gcloud beta functions deploy broadcastMessage --trigger-http`
    ```

    This will upload the function to Google and make it triggerable.
1. Test the returned URL by posting to it. See the `test.http` file for an example. That file is "executable" by installing the [REST Client extension for VSCode][rest-vscode].

[rest-vscode]: https://marketplace.visualstudio.com/items?itemName=humao.rest-client

### Integration

More like guidelines than rules. Post to the URL. For Samsung Smartthings, which this was developed for, simply add this to apps or device handlers where you need a message broadcast:

```
  def params = [
    uri: "https://xxx.cloudfunctions.net/broadcastMessage",
    body: [
        message: "text",
        secret: "xxx",
    ]
  ]

  httpPostJson(params)
```

### Development

* Use the Google Cloud functions emulator.

* Portions of the original Google Assistant package were modified to write to Google Cloud Storage directly instead of to the disk. Additionally, much of it has been converted to Typescript.

## Uses

* Laundry Machines
* Cooking Appliances
* Freaking out people
* Software Development Build Status and Lifecycle
