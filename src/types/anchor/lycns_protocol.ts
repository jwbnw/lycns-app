/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/lycns_protocol.json`.
 */
export type LycnsProtocol = {
  "address": "9do5xiZwNG2TgRWY3sREraaeHQ6QDvRdLnsSVvS3DcyY",
  "metadata": {
    "name": "lycnsProtocol",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "purchaseLicense",
      "docs": [
        "Atomic purchase with a 1.5% protocol fee."
      ],
      "discriminator": [
        42,
        213,
        241,
        95,
        60,
        182,
        79,
        151
      ],
      "accounts": [
        {
          "name": "asset",
          "writable": true
        },
        {
          "name": "ownerAccount",
          "writable": true
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "registerAsset",
      "docs": [
        "Registers a new asset. The PDA is derived from the pixel_hash."
      ],
      "discriminator": [
        21,
        80,
        155,
        149,
        117,
        207,
        235,
        16
      ],
      "accounts": [
        {
          "name": "asset",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  115,
                  115,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "pixelHash"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "pixelHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "manifestHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "isExclusive",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "asset",
      "discriminator": [
        234,
        180,
        241,
        252,
        139,
        224,
        160,
        8
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "assetAlreadySold",
      "msg": "This exclusive asset has already been sold."
    }
  ],
  "types": [
    {
      "name": "asset",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "pixelHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "manifestHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "trustLevel",
            "type": "u8"
          },
          {
            "name": "isExclusive",
            "type": "bool"
          },
          {
            "name": "isSold",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
