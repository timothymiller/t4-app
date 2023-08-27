import { Meta } from "@storybook/react";

import { PasswordResetComponent } from "./PasswordReset";

export default {
  title: "Components/PasswordReset",
  component: PasswordResetComponent,
  argTypes: { 
    type: {
      options: ["email", "password"],
      control: {
        type: "radio"
      }
    },
    handleWithPress: { action: "handleWithPress" },
  },
} satisfies Meta<typeof PasswordResetComponent>;

export const EmailStep = {
  args: {
    type: "email",
  },
};

export const PasswordStep = {
  args: {
    type: "password",
  },
};