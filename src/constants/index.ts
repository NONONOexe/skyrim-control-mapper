export const STANDARD_FILE_HEADER = `// 1st field: User event name.  DO NOT ALTER!  This field is used to ID events in the code							
// 2nd: Keyboard key ID that will proc this event.  A value of 0xff means the event is unmapped for this device.							
// 3rd: Mouse button ID that will proc this event.							
// 4th: Gamepad button ID that will proc this event.							
// 5th: If set to 1, this event can be remapped to a keyboard key
// 6th: If set to 1, this event can be remapped to a mouse button
// 7th: If set to 1, this event can be remapped to a gamepad button
// 8th (Optional): User event binary flag.  Used to group together related user events, like "Movement" or
// "Menu", so they can be toggled on and off together
//							
// Blank lines signify the start of a new input context.							
// See ControlMap.h for more details on input contexts.							
//							
`;

export const LOCAL_STORAGE_KEY = "skyrim-control-mapper-file";

export const UPLOAD_BUTTON_TEXT = "Upload controlmap.txt";
export const DOWNLOAD_BUTTON_TEXT = "Download controlmap.txt";
export const LOAD_DEFAULTS_TEXT = "Load Defaults";

export const DEFAULT_NEW_FORMAT_OPTION = {
    label: "Skyrim AE 1.6.640 (New Format)",
    filename: "Skyrim_AE_NewFormat",
};

export const DEFAULT_OLD_FORMAT_OPTION = {
    label: "Skyrim SE 1.5.97 (Old Format)",
    filename: "Skyrim_SE_OldFormat",
};
