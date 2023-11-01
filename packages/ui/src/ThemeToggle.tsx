import { useState } from "react";
import { useThemeSetting } from "@tamagui/next-theme";
import { Monitor, Sun, Moon } from "@tamagui/lucide-icons";
import type { ButtonProps } from "tamagui";
import { Button, useIsomorphicLayoutEffect } from "tamagui";

const icons = {
  system: Monitor,
  light: Sun,
  dark: Moon
}
export const ThemeToggle = (props: ButtonProps) => {
  const themeSetting = useThemeSetting()!;
  const [clientTheme, setClientTheme] = useState<string>("system");

  useIsomorphicLayoutEffect(() => {
    if (themeSetting.resolvedTheme !== "system") {
      document
        .querySelector("#theme-color")
        ?.setAttribute(
          "content",
          themeSetting.resolvedTheme === "light" ? "#fff" : "#050505"
        );
    }

    setClientTheme(themeSetting.current || "system");
  }, [themeSetting.current, themeSetting.resolvedTheme]);

  return (
    <Button
      size="$4"
      onPress={themeSetting.toggle}
      {...props}
      aria-label="Toggle color scheme"
      icon={icons[clientTheme]}
    />
  );
};
