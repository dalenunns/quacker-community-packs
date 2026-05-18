# Quacker Community Packs

Welcome to the `quacker-community-packs` repository! This repository hosts community-contributed "QuackPacks" for the [Quacker application](https://quacker.cc/).

## What is a QuackPack?

A QuackPack is a folder (which will be packaged into a ZIP archive) containing all necessary data for a single conference. The structure of a QuackPack is as follows:

```text
duckconf/
├── config.json         # The conference configuration (handles, frames, colors)
└── assets/             # Directory containing all assets including logo
    ├── logo.png
    ├── duck_blue.png
    └── duck_yellow.png
```

## Contribution Workflow

1. Fork this repository.
2. Create a folder with your conference name (e.g., `devconf_2026`).
3. Inside your folder, include your `config.json` and assets.
4. Submit a Pull Request.

Upon merging, an automated CI/CD Build Step will:
* Validate your `config.json` against the schema.
* Zip the folder into a QuackPack (`.zip`).
* Deliver the ZIP file to the main `quacker` application, updating the central `registry.json` index.

## Testing Your QuackPack

Before submitting a Pull Request, you can test how your QuackPack looks and feels in the [Quacker application](https://quacker.cc/) by using the "Sideloading" feature:

1. **Zip your folder:** Compress the contents of your completed conference folder into a standard `.zip` file. (The zip should contain `config.json` at its root).
2. **Open Quacker:** Go to the live [Quacker application](https://quacker.cc/).
3. **Import:** Click the "Import QuackPack" button located in the top header toolbar (nestled between the Infosec Mode and Dark Mode toggle buttons).
4. **Select your `.zip`:** Choose the `.zip` file you created from your local device.
5. **Test:** Quacker will temporarily load your configuration and image assets directly into memory. You can test your assets and ensure everything looks correct.
6. **Volatility:** Since the files are parsed into memory, the sideloaded conference vanishes when the tab is closed or refreshed.


## `config.json` Schema

The `config.json` file is required and defines how your conference appears in Quacker. Here is the schema and description of the fields:

### Example `config.json`

```json
{
    "name": "DuckConf 2026",
    "website": "https://www.duckconf.example.com",
    "enabled": true,
    "availableFrom": "2026-05-01T00:00:00Z",
    "availableUntil": "2026-06-01T00:00:00Z",
    "branding": {
        "url": "logo.png",
        "size": 300,
        "padding": 40,
        "anchor": "top-right"
    },
    "default_hashtags": [
        "#DuckConf2026"
    ],
    "handles": {
        "@duckconf": {
            "twitter": "@duckconf",
            "mastodon": "@duckconf@mastodon.cloud",
            "bluesky": "@duckconf.example.com"
        }
    },
    "frames": [
        {
            "id": "duckconf_banner_logo",
            "name": "DuckConf Banner",
            "type": "dynamic_banner",
            "defaultText": "#DuckConf2026\nhttps://www.duckconf.example.com",
            "bgColor": "#1c1917",
            "borderColor": "#ffffff",
            "textColor": "#ffffff",
            "opacity": 0.9,
            "height": 130,
            "margin": 30,
            "borderRadius": 30,
            "fontSize": 30,
            "assets": [
                {
                    "url": "logo.png",
                    "anchor": "right",
                    "size": 250,
                    "padding": 20
                }
            ]
        }
    ]
}
```

### Top-Level Fields

*   `name` (String, **Required**): The display name of the conference.
*   `website` (String, **Required**): The main website URL for the conference.
*   `enabled` (Boolean, Optional): Defaults to `true`. Set to `false` to hide the conference from the public dropdown.
*   `availableFrom` (ISO 8601 String, Optional): The date and time when the conference becomes available.
*   `availableUntil` (ISO 8601 String, Optional): The date and time when the conference is no longer available.
*   `branding` (Object, Optional): The global branding logo configuration.
    *   `url` (String, **Required**): Relative path to the image (e.g., `"logo.png"`).
    *   `size` (Number, Optional): Size of the image.
    *   `padding` (Number, Optional): Padding around the image.
    *   `anchor` (String, Optional): Anchor position (`"top-right"`, `"bottom-left"`, etc.).
*   `default_hashtags` (Array of Strings, Optional): Hashtags automatically appended to posts.
*   `handles` (Object, Optional): Mapping of user handles to their platform-specific usernames.
*   `frames` (Array of Objects, **Required**): Definitions for the available frames/overlays.

### Frame Object Fields

*   `id` (String, **Required**): A unique identifier for the frame.
*   `name` (String, **Required**): The display name of the frame in the Quacker UI.
*   `type` (String, Optional): Type of the frame (e.g., `"dynamic_banner"`).
*   `disabled` (Boolean, Optional): If `true`, the frame is not selectable.
*   `defaultText` (String, Optional): Default text to display in the banner.
*   `bgColor` (String, Optional): Background color hex code.
*   `borderColor` (String, Optional): Border color hex code.
*   `textColor` (String, Optional): Text color hex code.
*   `opacity` (Number, Optional): Background opacity (0 to 1).
*   `height` (Number, Optional): Height of the banner.
*   `margin` (Number, Optional): Margin of the banner.
*   `borderRadius` (Number, Optional): Border radius of the banner.
*   `fontSize` (Number, Optional): Font size of the text.
*   `assets` (Array of Objects, Optional): Images to overlay on the frame.

#### Frame Asset Fields

*   `url` (String, **Required**): Filename of the asset image in the assets folder (e.g., `"duck_blue.png"`).
*   `anchor` (String, **Required**): Positioning (`"top-left"`, `"top-right"`, `"bottom-left"`, `"bottom-right"`, `"left"`, `"right"`, `"top"`, `"bottom"`).
*   `size` (Number, Optional): Image size.
*   `padding` (Number, Optional): Padding around the image.
*   `offsetY` (Number, Optional): Vertical offset.
*   `flipX` (Boolean, Optional): If `true`, horizontally flips the image.
