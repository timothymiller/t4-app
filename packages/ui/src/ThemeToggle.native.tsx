// import { useState, useEffect } from "react";
// import { Monitor, Sun, Moon } from "@tamagui/lucide-icons";
// import type { ButtonProps } from "tamagui";
// import { Button } from "tamagui";
// import { ThemeVariant } from 'app/utils/theme'
// import { useAppTheme } from 'app/atoms/theme'
// import { useForceUpdate } from '@t4/ui'

// const icons = {
//   system: Monitor,
//   light: Sun,
//   dark: Moon
// }
// export const ThemeToggle = (props: ButtonProps) => {
//   const [clientTheme, setClientTheme] = useState<ThemeVariant>("system")
//   const [_, setAppTheme] = useAppTheme()
//   const forceUpdate = useForceUpdate()

//   useEffect(() => {
//     setAppTheme(clientTheme)
//     forceUpdate()
//   }, [clientTheme]);

//   return (
//     <Button
//       size="$4"
//       onPress={() => {
//         if(clientTheme === "system") {
//           setClientTheme("dark")
//         } else if(clientTheme === "dark") {
//           setClientTheme("light")
//         } else {
//           setClientTheme("system")
//         }
//       }}
//       aria-label="Toggle color scheme"
//       icon={icons[clientTheme]}
//       {...props}
//     />
//   );
// };
