import { Meta } from "@storybook/react";

import {PasswordResetComponent} from "./PasswordReset";

export default {
  title: "components/PasswordReset",
  component: PasswordResetComponent,
  argTypes: { 
    handleWithPress: { action: "handleWithPress" },
  },
} satisfies Meta<typeof PasswordResetComponent>;

export const Basic = {
  args: {
    type: "email",
  },
};