import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { codes } from "../constants/inputCodes";
import { parseNumber } from "../utils/parseUtils";

export function CodeInputCell({
    value,
    type,
    onChange,
}: {
    value: number;
    type: keyof typeof codes;
    onChange: (code: number) => void;
}) {
    return (
        <FormControl
            variant="standard"
            sx={{
                minWidth: 0,
                whiteSpace: "nowrap",
                flexGrow: 0,
            }}
        >
            <Select
                value={String(value)}
                onChange={(e: SelectChangeEvent<string>) =>
                    onChange(parseNumber(e.target.value as string))
                }
                sx={{ minWidth: 0 }}
            >
                {Object.entries(codes[type]).map(([key, codeValue]) => (
                    <MenuItem value={String(codeValue)} key={codeValue}>
                        {key}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
