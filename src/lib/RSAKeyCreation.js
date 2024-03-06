/**
 * Most functions borrowed from examples at SubtleCrypto docs
 * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
 */

import { ab2str, str2ab } from "./ArrayBuffer";

/**
 * Creates RSA keypair using Web Crypto API's SubtleCrypto interface.
 * @param {number} modulusLength The length of the modulus in bits
 * @returns {Promise<CryptoKeyPair>} A promise that resolves to an object containing the public and private keys
 */
export async function createKeyPair(modulusLength) {
    let keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: modulusLength,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"],
    );
    return keyPair;
}

/**
 * Export key CryptoKey RSA object to string
 * @param {CryptoKey} key The CryptoKey object to export
 * @param {string} keyType Two options, "public" or "private" depending on type of key format
 * @returns {Promise<string>} A promise resolving to a string encoded in base64 of the key object
 */
export async function exportRSAKey(key, keyType) {
    if (keyType === "public") {
        const exported = await window.crypto.subtle.exportKey("spki", key);
        const exportedAsString = ab2str(exported);
        const exportedAsBase64 = window.btoa(exportedAsString);
        const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
        return pemExported;
    } else {
        const exported = await window.crypto.subtle.exportKey("pkcs8", key);
        const exportedAsString = ab2str(exported);
        const exportedAsBase64 = window.btoa(exportedAsString);
        const pemExported = `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
        return pemExported;
    }
}

/**
 * Import base64 encoded string of a CryptoKey RSA object
 * @param {string} pem A CryptoKey base64 encoded string
 * @param {string} keyType Two options, "public" or "private" depending on type of key format
 * @returns {Promise<CryptoKey>} A promise resolving to a CryptoKey object
 */
export async function importRSAKey(pem, keyType) {
    // fetch the part of the PEM string between header and footer
    const pemHeader = keyType === "public" ? "-----BEGIN PUBLIC KEY-----" : "-----BEGIN PRIVATE KEY-----";
    const pemFooter = keyType === "public" ? "-----END PUBLIC KEY-----" : "-----END PRIVATE KEY-----";
    const pemContents = pem.substring(
        pemHeader.length,
        pem.length - pemFooter.length - 1,
    );
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = str2ab(binaryDerString);

    return window.crypto.subtle.importKey(
        keyType === "public" ? "spki" : "pkcs8",
        binaryDer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        true,
        keyType === "public" ? ["encrypt"] : ["decrypt"]
    );
}