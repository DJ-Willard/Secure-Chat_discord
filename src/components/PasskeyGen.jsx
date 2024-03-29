/**
 * Generates a new AES key encrypted with the recipient's RSA public key for secure communication.
 * This function prompts the user to upload the recipient's public key file, generates a new AES key,
 * encrypts it with the public key, and saves the encrypted AES key locally.
 * 
 * @module PasskeyGen
 * @author [Ethan Cha]
 */

import fs from "fs";
import { encryptAESKey, exportAESKey } from "../lib/AESKey";
import { importRSAKey } from "../lib/RSAKeyCreation";


/**
 * Function to generate a new AES key encrypted with the recipient's RSA public key.
 * Prompts the user to upload the recipient's public key file and generates the AES key.
 * 
 * @returns {void}
 */
export function PasskeyGen() {
  const pluginDirectory = BdApi.Plugins.folder + "/SecureChat";
  const SelectedChannelStore = BdApi.Webpack.getStore("SelectedChannelStore");
  const channelId = SelectedChannelStore.getChannelId();
  const keyExists = fs.existsSync(pluginDirectory + `/PRIVATE-${channelId}.key`) || fs.existsSync(pluginDirectory + `/PUBLIC-${channelId}.key`)

  // Note to user
  BdApi.UI.showConfirmationModal(
    "Create Key",
    keyExists ? `You already have a key that exists for channel ID ${channelId}, are you sure you want to create a new key? This will __overwrite__ your existing key and you will not be able to decrypt older messages!`
    : `This will generate an AES key that is encrypted with the recipient's public key (recipient must send you this). This only needs to be done once per user by one user. This will only work in this DM. **DO NOT SEND THE KEY THAT BEGINS WITH \`PRIVATE-\`**`,
    {
      confirmText: "Create",
      cancelText: "Cancel",
      // Insert public key
      onConfirm: () => {
        BdApi.UI.showConfirmationModal(
          "Insert recipient's public key",
          <input type="file" accept=".pem" id="fileInput" />,
          {
            confirmText: "Submit",
            cancelText: "Cancel",
            // Process public key
            onConfirm: async () => {
              const fileInput = document.getElementById('fileInput');
              const file = fileInput.files[0]; // Get the first file from the input
              if (!file) {
                console.error("No file selected");
                return;
              }

              const reader = new FileReader();
              reader.onload = async (event) => {
                const pubKeyFile = event.target.result; // Contents of the file
                const pubKey = await importRSAKey(pubKeyFile, 'public');
                // Generate a new random key
                const aesKey = await window.crypto.subtle.generateKey(
                  {
                    name: "AES-GCM",
                    length: 256,
                  },
                  true,
                  ["encrypt", "decrypt"],
                );

                // Personal unencrypted copy so the sender can encrypt/decrypt their own messages. They will not send this
                const aesKeyStr = await exportAESKey(aesKey);
                fs.writeFileSync(`${pluginDirectory}/PRIVATE-${channelId}.key`, aesKeyStr);
                // Encrypt the new AES key
                const encryptedAESkey = await encryptAESKey(aesKey, pubKey);
                fs.writeFileSync(`${pluginDirectory}/PUBLIC-${channelId}.key`, encryptedAESkey);
                BdApi.UI.showToast(`AES key created. Send the PUBLIC-${channelId}.key file to recipient`, { type: "success", timeout: 8000 });
                // Further processing with pubKey
              };
              reader.readAsText(file);
            },
            onCancel: () => console.log("Pressed 'Cancel' or escape")
          }
        )
      },
      onCancel: () => console.log("Pressed 'Cancel' or escape")
    }
  );
}