# Skyrim Control Mapper

## Overview

[Japanese README / 日本語版はこちら](locales/ja/README.md)

Skyrim Control Mapper is a web application that allows you to easily edit the key mapping for "The Elder Scrolls V: Skyrim" using a graphical user interface (GUI).

In Skyrim, you can set key bindings through the in-game options. However, for more detailed settings, such as combinations of controller buttons, you need to directly edit the `controlmap.txt` file located within the game directory. This file is tab-separated and written in hexadecimal, making manual editing very difficult. Furthermore, saving it in an incorrect format can prevent the game from launching.

This application provides a visual editor for intuitively and safely editing this `controlmap.txt` file.

## Features

- User interface for visually editing `controlmap.txt`
- Function to load Skyrim's default settings (supports new and old versions)
- Supports gamepad, keyboard, and mouse control devices
- Allows assigning multiple keys to a single action, and assigning by key combinations

## How to Use

You can edit `controlmap.txt` in the following three steps:

### Step 1: Preparing the `controlmap.txt` file

The `controlmap.txt` file to be edited is usually located at the following path:

```txt
[Skyrim Game Directory]\Data\Interface\Controls\PC\controlmap.txt
```

Please copy this file to any other location.

### Step 2: Editing with the Application

Access [Skyrim Control Mapper](https://nononoexe.github.io/skyrim-control-mapper/) and edit following these steps:

1. **Load the configuration file**:
   Upload the `controlmap.txt` file you copied. Alternatively, you can select and load default settings matching your target Skyrim version (select "New Version" for version 1.6.640 and later, and "Old Version" for earlier versions).

2. **Edit the key mapping**:
   Assign gamepad, keyboard, or mouse keys to the displayed action items. You can also assign multiple keys.

3. **Download the configuration file**:
   Once editing is complete, click the button to download the edited `controlmap.txt` file.

### Step 3: Applying to the Game

Overwrite the original location (`[Skyrim Game Directory]\Data\Interface\Controls\PC\`) you noted in Step 1 with the downloaded `controlmap.txt` file.

The new key mapping will be applied when you start Skyrim.

## Before You Start - Important Note

- **Always back up your `controlmap.txt` file!** This application may contain bugs. There's a risk that the content of the uploaded file could be lost or unexpected keys might be assigned. Please be sure to back up your `controlmap.txt` file.
- Use of this application is at your own risk.

## Reporting Issues and Suggestions for Improvement

Bug reports and suggestions for improvement regarding this application are welcome. Please report them on [Issues](https://github.com/NONONOexe/skyrim-control-mapper/issues).

When reporting a bug, attaching the `controlmap.txt` file where the issue occurred (both before and after editing, if available, would be very helpful) would allow for a smoother investigation and better understanding of the situation.

## Credits

This application was developed based on [SkyrimControlMapper](https://github.com/Hawkbat/SkyrimControlMapper) created by Hawkbat. We thank this wonderful original project.

## License

This application is released under the MIT License. For details, please see the [LICENSE file](LICENSE) included in the repository.
