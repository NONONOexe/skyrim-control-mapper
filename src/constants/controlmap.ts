export const FILE_HEADER = `// 1st field: User event name.  DO NOT ALTER!  This field is used to ID events in the code							
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
