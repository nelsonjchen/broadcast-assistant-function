/**
 *  Broadcast Assistant Function
 *
 *  Copyright 2018 Nelson Chen
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License. You may obtain a copy of the License at:
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed
 *  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License
 *  for the specific language governing permissions and limitations under the License.
 *
 */
metadata {
    definition (name: "Assistant Relay", namespace: "nelsonjchen", author: "Nelson Chen") {
		capability "Actuator"
        command "broadcast", [ "string" ]
    }
}


def broadcast(text) {
  def params = [
    uri: "https://xxx.cloudfunctions.net/broadcastMessage",
    body: [
        message: text,
        secret: "xxx",
    ]
  ]

  httpPostJson(params)
}
