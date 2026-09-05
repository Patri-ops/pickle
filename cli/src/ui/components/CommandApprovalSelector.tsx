import chalk from "chalk";
import { Box, Text, useInput } from "ink";
import type { FC } from "react";
import React, { useState } from "react";

// Modern pastel color palette inspired by contemporary CLI tools
const COLORS = {
  headerFg: "#4A5568", // Darker gray for headers
  contextFg: "#6B7280", // Soft gray
  focusColor: "#A78BFA", // Soft purple
  warningColor: "#F59E0B", // Amber for warnings
  acceptColor: "#10B981", // Green for accept
  rejectColor: "#EF4444", // Red for reject
} as const;

interface ApprovalOption {
  id: "accept" | "reject";
  label: string;
  symbol: string;
}

const APPROVAL_OPTIONS: ApprovalOption[] = [
  { id: "accept", label: "Accept", symbol: "✓" },
  { id: "reject", label: "Reject", symbol: "✗" },
];

interface CommandApprovalSelectorProps {
  command: string;
  args: string[];
  cwd?: string;
  onApproval: (approved: boolean) => void;
}

export const CommandApprovalSelector: FC<CommandApprovalSelectorProps> = ({
  command,
  args,
  cwd,
  onApproval,
}) => {
  const [cursor, setCursor] = useState(0);

  const fullCommand = [command, ...args].join(" ");

  useInput((input, key) => {
    if (key.upArrow) {
      setCursor((prev) => (prev > 0 ? prev - 1 : APPROVAL_OPTIONS.length - 1));
      return;
    }

    if (key.downArrow) {
      setCursor((prev) => (prev < APPROVAL_OPTIONS.length - 1 ? prev + 1 : 0));
      return;
    }

    if (key.return) {
      const selectedOption = APPROVAL_OPTIONS[cursor];
      const approved = selectedOption.id === "accept";
      onApproval(approved);
      return;
    }
  });

  return (
    <Box flexDirection="column" gap={1}>
      {/* Header with command details */}
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="yellow"
        paddingX={3}
        paddingY={1}
        marginBottom={1}
      >
        <Box marginBottom={1}>
          <Text color="yellow" bold>
            {chalk.hex(COLORS.warningColor)("⚠ Command Execution Request")}
          </Text>
        </Box>

        <Box flexDirection="column" gap={0} marginTop={1}>
          <Box>
            <Text color="gray">
              {chalk.hex(COLORS.contextFg)("Command: ")}
            </Text>
            <Text bold>{chalk.hex(COLORS.headerFg)(fullCommand)}</Text>
          </Box>

          {cwd && (
            <Box marginTop={1}>
              <Text color="gray">
                {chalk.hex(COLORS.contextFg)("Working Directory: ")}
              </Text>
              <Text>{chalk.hex(COLORS.headerFg)(cwd)}</Text>
            </Box>
          )}
        </Box>

        <Box marginTop={1}>
          <Text color="yellow">
            {chalk
              .hex(COLORS.warningColor)
              .italic(
                "This command will execute with your local system privileges."
              )}
          </Text>
        </Box>
      </Box>

      {/* Action section */}
      <Box flexDirection="column" paddingX={3} gap={1}>
        <Box marginBottom={1}>
          <Text>{chalk.hex(COLORS.headerFg).bold("Review Decision")}</Text>
        </Box>

        <Text>
          {chalk.hex(COLORS.contextFg)("Use ↑/↓ to navigate, Enter to confirm")}
        </Text>

        <Box flexDirection="column" gap={0} marginTop={1}>
          {APPROVAL_OPTIONS.map((option, index) => {
            const isFocused = index === cursor;
            const isAccept = option.id === "accept";

            return (
              <Box key={option.id} paddingY={0}>
                <Text>
                  {isFocused ? chalk.hex(COLORS.focusColor)("▶ ") : "  "}
                  {isFocused
                    ? chalk
                        .hex(COLORS.focusColor)
                        .bold(`${option.symbol} ${option.label}`)
                    : isAccept
                    ? chalk.hex(COLORS.acceptColor)(
                        `${option.symbol} ${option.label}`
                      )
                    : chalk.hex(COLORS.rejectColor)(
                        `${option.symbol} ${option.label}`
                      )}
                </Text>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
