import fs from "fs";
import { encryptMessage } from "../lib/hybridencrypt";
import { decryptAESKey } from "../lib/AESKey";
import { importStringToKey } from "../lib/RSAKeyCreation";

export default function EncryptButton() {
    const pluginDirectory = BdApi.Plugins.folder + "/SecureChat";

    function handleClick() {
        const SelectedChannelStore = BdApi.Webpack.getStore("SelectedChannelStore");
        const messageActions = BdApi.Webpack.getByKeys("sendMessage");
        const userIdModule = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byKeys("getCurrentUser"));
        let channelId = SelectedChannelStore.getChannelId();
        let userId = userIdModule.getCurrentUser().id;
        let message = "";
        function TextInput(props) {
            return <textarea
                placeholder={props.placeholder || "Enter plaintext to encrypt"}
                onChange={props?.onChange}
            />;
        }

        function sendMessage(content) {
            messageActions.sendMessage(SelectedChannelStore.getChannelId(), {
                content,
                invalidEmojis: [],
                tts: false,
                validNonShortcutEmojis: []
            });
        }

        BdApi.UI.showConfirmationModal(
            "Encrypt Text: Make sure you have already exchanged AES keys first!",
            <TextInput
                placeholder="Enter encrypted text..."
                onChange={event => {
                    console.log(event.target.value);
                    message = event.target.value;
                }}
            />,
            {
                confirmText: "Send",
                cancelText: "Cancel",
                onConfirm: () => {
                    console.log(`Pressed Send, send encrypted message here: ${message}`);
                    (async () => {
                        // TODO: only run this block of code if PRIVATE-<channel-id>.key is NOT present in pluginDirectory, non-private key is encrypted
                        const encryptedAESkey = fs.readFileSync(`${pluginDirectory}/${channelId}.key`, 'utf8');
                        const privKeyFile = fs.readFileSync(`${pluginDirectory}/private-${userId}.pem`, 'utf8');
                        const privKey = await importStringToKey(privKeyFile, 'private');
                        console.log("private key imported");
                        const decryptedAESkey = await decryptAESKey(encryptedAESkey, privKey)
                        console.log(decryptedAESkey);

                        //const encryptedText = await encryptMessage(); //TODO: complete this with key file parsing with channel-id.key
                    })();
                },
                onCancel: () => console.log("Pressed 'Cancel' or escape")
            }
        );
    }

    return (
        <button className="my-component" onClick={handleClick}>
            Encrypt
        </button>
    )
}